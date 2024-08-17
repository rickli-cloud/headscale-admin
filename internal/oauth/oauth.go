package oauth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	"github.com/rickli-cloud/headscale-admin/internal/config"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

var provider *oidc.Provider
var oauth2Config oauth2.Config
var verifier *oidc.IDTokenVerifier

var session_cookie = "hsadm_sess"
var state_cookie = "hsadm_oauthstate"

func Init(ctx context.Context) error {
	if len(config.Cfg.Oidc.Issuer) <= 0 {
		return fmt.Errorf("oidc.Issuer is undefined")
	}

	oidcConfig := oidc.Config{
		ClientID:        config.Cfg.Oidc.Client_id,
		SkipIssuerCheck: config.Cfg.Unsafe_disable_oidc_issuer_check,
	}

	var err error
	provider, err = oidc.NewProvider(getOidcProvierContext(ctx, config.Cfg.Oidc.Issuer), config.Cfg.Oidc.Issuer)
	if err != nil {
		return err
	}

	verifier = provider.Verifier(&oidcConfig)

	oauth2Config = oauth2.Config{
		ClientID:     config.Cfg.Oidc.Client_id,
		ClientSecret: config.Cfg.Oidc.Client_secret,
		Endpoint:     provider.Endpoint(),
		RedirectURL:  config.Cfg.Server_Url + "/oauth/callback",
		Scopes:       config.Cfg.Oidc.Scopes,
	}

	return nil
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(session_cookie)
		if err != nil || len(cookie.Value) <= 0 {
			handleRedirect(w, r)
			return
		}

		_, err = verifier.Verify(r.Context(), cookie.Value)
		if err != nil {
			handleRedirect(w, r)
			return
		}

		// TODO: add claim based restrictions
		/* var claims struct {
			Email string `json:"email"`
		}
		if err := idToken.Claims(&claims); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		} */

		next.ServeHTTP(w, r)
	})
}

func HandleCallback(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	state := r.FormValue("state")
	if state == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	cookie, err := r.Cookie(state_cookie)
	if err != nil || cookie.Value != state {
		http.Error(w, "Bad Request", http.StatusUnauthorized)
		return
	}

	code := r.FormValue("code")
	if code == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	token, err := oauth2Config.Exchange(r.Context(), code)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	_, err = verifier.Verify(r.Context(), rawIDToken)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     session_cookie,
		Value:    rawIDToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func handleRedirect(w http.ResponseWriter, r *http.Request) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	state := strings.TrimRight(base64.URLEncoding.EncodeToString(b), "=")

	http.SetCookie(w, &http.Cookie{
		Name:     state_cookie,
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	http.Redirect(w, r, oauth2Config.AuthCodeURL(state), http.StatusFound)
}

func getOidcProvierContext(ctx context.Context, issuer string) context.Context {
	if config.Cfg.Unsafe_disable_oidc_issuer_check {
		return oidc.InsecureIssuerURLContext(ctx, issuer)
	}
	return ctx
}
