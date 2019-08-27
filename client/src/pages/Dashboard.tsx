/*
// TODO: make the code typescript specific
// TODO: add button to create Company clients
// TODO: wheen clicked show form
// TODO: after form show update table
// TODO: after table updated show client details
// TODO: after client details added show documents or fill users
// TODO: after that show client data report.
 */

import React, { RefObject } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/UserActionCreator";
import _ from "lodash";
import { Form, Button, Icon, Container, Header } from "semantic-ui-react";
import {  Label, Menu, Table } from "semantic-ui-react"; // Icon
import { Link } from "react-router-dom";

import { CONTAINER_STYLE } from "../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import CustomersTable from "./CustomersTable";
import CorporationsTable from "./CorporationsTable";
import CreateCorporation from "./CreateCorporation";
import CreateCustomer from "./CreateCustomer";
interface Props {
    state: AppState;
    actions: UserActionCreator;
}

interface States {}
class Dashboard extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    // TODO: Add validation and types
    render(): React.ReactElement<any> {
      if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (

            <Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>Enjoy</Header>
                <CorporationsTable></CorporationsTable>
                <CreateCorporation></CreateCorporation>
                <CustomersTable></CustomersTable>
                <CreateCustomer></CreateCustomer>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }

    private login = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        if (_.isString(email) && _.isString(password)) {
            this.props.actions.login(email, password);
        } else {
            // TODO: prompt error
        }
    };
}

export default connectPropsAndActions(Dashboard);