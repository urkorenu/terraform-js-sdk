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

  // Initialize Terraform
  init() {
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
    const filePath = path.join(this.workDir, "main.tf");
    const tfConfig = this.generateTerraformConfig(resourceType, config);
    fs.writeFileSync(filePath, tfConfig);
    console.log(`Terraform config written to ${filePath}`);
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
}

module.exports = Terraform;

