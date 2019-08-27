import React from "react";
import { Form, Button, Icon, Container } from "semantic-ui-react";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { CONTAINER_STYLE } from "../shared/styles";

const CreateCustomer = () => (
    <Container text style={CONTAINER_STYLE}>
                  <Form>
                    <ResponsiveFormField>
                        <label>Company name</label>
                        <input placeholder="Company name"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Contact name</label>
                        <input  placeholder="Contact name"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Company email</label>
                        <input  placeholder="Company email"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Street Address </label>
                        <input  placeholder="Street Address"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>City</label>
                        <input  placeholder="City"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>State / Province </label>
                        <input  placeholder="State/ Province"  />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>Country </label>
                        <input  placeholder="Country"  />
                    </ResponsiveFormField>


                    <Button primary type="submit" onClick={ undefined} loading={undefined} disabled={undefined}>
                        <Icon name="check circle outline" />
                        Register
                    </Button>
                </Form>
                </Container>

);

export default CreateCustomer;


