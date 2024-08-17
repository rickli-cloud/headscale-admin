package config

import (
	"log"
	"os"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

type HeadscaleConfig struct {
	Config_Path string
}

func (headscaleCfg *HeadscaleConfig) load(appCfg *AppConfiguration) *AppConfiguration {
	err := envconfig.Process("hsadm", headscaleCfg)
	if err != nil {
		log.Fatalf("Failed to load env config: %s", err.Error())
	}

	if len(headscaleCfg.Config_Path) > 0 {
		ymlFile, err := os.ReadFile(headscaleCfg.Config_Path)

		if err != nil {
			log.Fatalf("Failed to load headscale yaml configuration: %s", err.Error())
		}

		err = yaml.Unmarshal(ymlFile, appCfg)
		if err != nil {
			log.Fatalf("Failed to parse headscale yaml configuration: %s", err.Error())
		}
	}

	return appCfg
}

type AppConfiguration struct {
	Listen_Addr  string `default:"0.0.0.0:8000" yaml:"admin_listen_addr"`
	Server_Url   string `yaml:"admin_server_url"`
	Mode         string `yaml:"admin_mode" default:"auto"`
	DebugConfig  bool   `default:"true"`
	Socket_Addr  string `yaml:"unix_socket"`
	Socket_Proto string `yaml:"unix_socket_proto" default:"unix"`
	Oidc         struct {
		Issuer        string   `yaml:"issuer"`
		Client_id     string   `yaml:"client_id"`
		Client_secret string   `yaml:"client_secret"`
		Scopes        []string `yaml:"scope"`
	}
	Unsafe_disable_authentication    bool `default:"false"`
	Unsafe_disable_oidc_issuer_check bool `default:"false"`
}

func (appCfg *AppConfiguration) load() *AppConfiguration {
	err := envconfig.Process("hsadm", appCfg)
	if err != nil {
		log.Fatalf("Failed to load env config: %s", err.Error())
	}

	return appCfg
}

type ClientEnvironment struct {
	PUBLIC_DISABLE_TOKEN_AUTH string
}

var HeadscaleCfg HeadscaleConfig
var Cfg AppConfiguration

func Load() AppConfiguration {
	HeadscaleCfg.load(&Cfg)
	Cfg.load()

	if Cfg.Unsafe_disable_authentication {
		if len(Cfg.Oidc.Issuer) > 0 || len(Cfg.Oidc.Client_id) > 0 || len(Cfg.Oidc.Client_secret) > 0 {
			Cfg.Unsafe_disable_authentication = false
			log.Fatal("[FAILSAFE] Unsafe_disable_authentication has been activated but Oidc configuration is present. Overwritten Unsafe_disable_authentication to false")
		} else {
			log.Println("WARNING! Authentication has been disabled!")
		}
	}

	if Cfg.Mode != "rest" && Cfg.Mode != "grpc" && Cfg.Mode != "auto" {
		log.Fatalf("Invalid configuration: HSADM_MODE expected auto|rest|grpc got: %s", Cfg.Mode)
	}

	if Cfg.Mode == "auto" {
		if len(Cfg.Socket_Addr) > 0 {
			Cfg.Mode = "grpc"
		} else {
			Cfg.Mode = "rest"
		}
	}

	if Cfg.Mode == "grpc" && !Cfg.Unsafe_disable_authentication {
		if len(Cfg.Server_Url) <= 0 {
			log.Fatal("Server_Url is required")
		}
		if len(Cfg.Oidc.Client_id) <= 0 {
			log.Fatal("oidc.client_id is required")
		}
		if len(Cfg.Oidc.Client_secret) <= 0 {
			log.Fatal("oidc.client_secret is required")
		}
	}

	if Cfg.DebugConfig {
		d, _ := yaml.Marshal(Cfg)
		log.Printf("Configuration: \n%s", string(d))
	}

	log.Printf("API mode: %s", Cfg.Mode)

	return Cfg
}
