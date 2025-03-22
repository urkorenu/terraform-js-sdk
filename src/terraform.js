const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class Terraform {
  constructor(workDir = "terraform_workspace") {
    this.workDir = workDir;
    this.initWorkspace();
  }

  // Create workspace directory if not exists
  initWorkspace() {
    if (!fs.existsSync(this.workDir)) {
      fs.mkdirSync(this.workDir);
    }
  }

  // Execute Terraform CLI commands
  runCommand(command) {
    try {
      console.log(`Executing: terraform ${command}`);
      const output = execSync(`terraform ${command}`, {
        cwd: this.workDir,
        stdio: "pipe",
      }).toString();
      console.log(output);
      return output;
    } catch (error) {
      console.error(`Error executing Terraform: ${error.message}`);
      process.exit(1);
    }
  }

  // Initialize Terraform (creates providers.tf if missing)
  init(providerConfig = {}) {
    this.createProvidersFile(providerConfig);
    return this.runCommand("init");
  }

  // Apply Terraform configuration
  apply() {
    return this.runCommand("apply -auto-approve");
  }

  // Destroy Terraform resources
  destroy() {
    return this.runCommand("destroy -auto-approve");
  }

  // Create a basic Terraform resource
  create(resourceType, config) {
    if (!config) {
      throw new Error("Missing required parameters");
    }
  
    const tfConfig = this.generateTerraformConfig(resourceType, config);
    fs.writeFileSync(`${this.workDir}/main.tf`, tfConfig);
    console.log(`Terraform config written to ${this.workDir}/main.tf`);
  
    return `Creating ${resourceType} with config: ${JSON.stringify(config)}`;
  }
  
  // Generate Terraform HCL configuration dynamically
  generateTerraformConfig(resourceType, config) {
    let tfConfig = `resource "${resourceType}" "example" {\n`;
    for (const [key, value] of Object.entries(config)) {
      tfConfig += `  ${key} = "${value}"\n`;
    }
    tfConfig += `}\n`;
    return tfConfig;
  }

  // Creates providers.tf with default or given provider configuration
  createProvidersFile(providerConfig) {
    const defaultProvider = {
      provider: "aws",
      region: "us-east-1",
    };
  
    const config = { ...defaultProvider, ...providerConfig };
  
    const providersTf = `
  terraform {
    required_providers {
      aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
      }
    }
  }
  
  provider "aws" {
    region = "${config.region}"
  }
  `;
  
    const providersPath = path.join(this.workDir, "providers.tf");
    fs.writeFileSync(providersPath, providersTf);
    console.log(`Terraform providers config written to ${providersPath}`);
  }
  
}

module.exports = Terraform;
