const Terraform = require("../src/terraform");

describe("Terraform SDK Tests", () => {
  let tf;
  let uniqueBucketName;

  beforeAll(() => {
    tf = new Terraform();
    uniqueBucketName = `test-bucket-${Date.now()}`;
  });

  test("Should initialize Terraform instance with default workspace", () => {
    expect(tf.workDir).toBe("terraform_workspace");
  });

  test("Should create a new S3 bucket", () => {
    const result = tf.create("aws_s3_bucket", { bucket: uniqueBucketName });
    expect(result).toContain(`Creating aws_s3_bucket`);
  });

  test("Should fail with missing required parameters", () => {
    expect(() => tf.create("s3", undefined)).toThrow("Missing required parameters");
  });

  test('Should apply Terraform changes', async () => {
    try {
      tf.init({ provider: "aws", region: "il-central-1" }); // Initialize here, before apply
      const result = await tf.apply();
      expect(result).toContain('Apply complete');
    } catch (error) {
      console.error('Terraform apply failed:', error);
      expect(false).toBeTruthy();
    }
  });

  afterAll(() => {
    tf.destroy(); // Cleanup after tests
  });
});