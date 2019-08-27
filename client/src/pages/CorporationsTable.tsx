import React from "react";
import { Button, Checkbox, Icon, Table, Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import { Link } from "react-router-dom";

const CorporationsTable = () => (
  <Container text style={CONTAINER_STYLE}>
  <Table celled>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell >Client List</Table.HeaderCell>
      <Table.HeaderCell>Last Modified</Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    <Table.Row>
    <Table.Cell><a href="https://react.semantic-ui.com/collections/table/">DEF Inc.</a></Table.Cell>
      <Table.Cell>07/14/19</Table.Cell>

    </Table.Row>
    <Table.Row>
      <Table.Cell>Acme Corp.</Table.Cell>
      <Table.Cell>07/02/19</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>GHI LLC.</Table.Cell>
      <Table.Cell>06/23/19</Table.Cell>
    </Table.Row>
  </Table.Body>
  </Table>

  <Button primary type="" as={Link} to={"/dashboard"}>
                        <Icon name="check circle outline" />
                        Add Client
                    </Button>
                    <Button primary type="" as={Link} to={"/dashboard"}>
                        <Icon name="check circle outline" />
                        Delete Client
                    </Button>
            </Container>

);

export default CorporationsTable;
