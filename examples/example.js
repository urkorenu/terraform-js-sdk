const Terraform = require("../src/terraform");

const tf = new Terraform();

// 1. Create an S3 bucket (example)
tf.create("aws_s3_bucket", { bucket: "my-example-bucket" });

// 2. Initialize Terraform
tf.init();

// 3. Apply the Terraform configuration
tf.apply();

// 4. Destroy resources (if needed)
// tf.destroy();

