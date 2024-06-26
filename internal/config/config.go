package config

import (
	"log"
	"os"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

type AppConfiguration struct {
	Config_path 		string
	Listen_Addr 		string 			`default:"0.0.0.0:8000" yaml:"admin_listen_addr"`
	Socket struct {
		Addr 					string 			`yaml:"unix_socket" default:"/var/run/headscale/headscale.sock"`
		Protocol 			string 			`default:"unix"`
	}
}

var Cfg AppConfiguration

func Load() AppConfiguration {
	Cfg.loadEnv()

	if Cfg.Config_path != "" {
		Cfg.loadYaml(Cfg.Config_path)
	}

	// Debug config
	// d, _ := yaml.Marshal(Cfg)
	// log.Println("Config debug:\n" + string(d))

	return Cfg
}


func (cfg *AppConfiguration) loadEnv() *AppConfiguration {
	err := envconfig.Process("hsadm", cfg)
	if err != nil {
		log.Fatal("Failed to load env config:", err.Error())
	}
	
	return cfg
}

func (cfg *AppConfiguration) loadYaml(path string) *AppConfiguration {
	ymlFile, err := os.ReadFile(path)
	if err != nil {
		log.Fatal("Failed to load yaml configuration:", err.Error())
	}

	err = yaml.Unmarshal(ymlFile, cfg)
	if err != nil {
		log.Fatal("Failed to parse yaml configuration:", err.Error())
	}

	return cfg
}
