const Terraform = require("../src/terraform");

test("Terraform instance initializes correctly", () => {
  const tf = new Terraform();
  expect(tf.workDir).toBe("terraform_workspace");
});

