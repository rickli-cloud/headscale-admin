package config

import (
	"log"
	"os"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v2"
)

type AppConfiguration struct {
	Config_path 	string
	Listen_Addr 	string	`default:"0.0.0.0:8000" yaml:"admin_listen_addr"`
	Mode			string 	`default:"auto"`
	DebugConfig		bool	`default:"true"`
	Socket struct {
		Addr 		string	`yaml:"unix_socket" default:"/var/run/headscale/headscale.sock"`
		Protocol 	string	`default:"unix"`
	}
}

var Cfg AppConfiguration

func Load() AppConfiguration {
	Cfg.loadEnv()

	if len(Cfg.Config_path) > 0 {
		Cfg.loadYaml(Cfg.Config_path)
	}
	
	if Cfg.Mode != "rest" && Cfg.Mode != "grpc" && Cfg.Mode != "auto" {
		log.Fatal("Invalid environment variable HSADM_MODE expected auto|rest|grpc got " + Cfg.Mode)
	}
	
	if Cfg.DebugConfig == true {
		d, _ := yaml.Marshal(Cfg)
		log.Println("Config debug:\n" + string(d))
	}

	if Cfg.Mode == "auto" && len(Cfg.Socket.Addr) > 0 {
		Cfg.Mode = "grpc"
	} 

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
