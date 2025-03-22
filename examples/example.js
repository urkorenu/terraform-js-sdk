const Terraform = require("../src/terraform");

const tf = new Terraform();

// 1. Create an S3 bucket (example)
tf.create("aws_s3_bucket", { bucket: Date.now() });

// 2. Initialize Terraform
tf.init({ provider: "aws", region: "il-central-1" });

// 3. Apply the Terraform configuration
tf.apply();

// 4. Destroy resources (if needed)
tf.destroy();

