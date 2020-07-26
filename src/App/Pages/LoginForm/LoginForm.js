import React from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import axios from 'axios';
import './LoginForm.scss';
import { Redirect } from 'react-router-dom';

export default class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {
                email: '',
                password: '',
                isLoggedIn: false,
                accessToken: ''
            },
            submitted: false,
        }
    }
    
   componentDidMount() {
    this.storeCollector();
   }

   storeCollector() {
       let user = JSON.parse(sessionStorage.getItem('user'));
       if(user && user.isLoggedIn) {
           this.setState({isLoggedIn: true, accessToken: user.accessToken});
       }
   }

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }

    handleSubmit = () => {
        this.setState({ submitted: true }, () => {
            setTimeout(() => this.setState({ 
                formData: {
                    email: '',
                    password: '',
                },
                submitted: false
             }), 5000);
        });

        /**
         * POST REQUEST
         */
        const { formData } = this.state;
        console.log(formData);
        axios.post(`/api/post/login`, { formData })
      .then(res => {
          const result = res.data.recordset;
          this.setState({ result });
          console.log("accessToken: " + JSON.stringify(res.data.accessToken));

          sessionStorage.setItem('user', JSON.stringify({
              isLoggedIn: true,
              accessToken: res.data.accessToken
          }))
          this.storeCollector();
      })
    }

    render() {
        /**
         * Redirect to Home Page
         */
        if(this.state.isLoggedIn) {
            return <Redirect to="/home" />
        }
        const { formData, submitted } = this.state;
        return (
        <div className="LoginForm">
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
            >
                <h2>Log In</h2>
                <TextValidator
                    label="Email"
                    onChange={this.handleChange}
                    name="email"
                    value={formData.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
                />
                <br />
                <TextValidator
                    label="Password"
                    onChange={this.handleChange}
                    name="password"
                    type="password"
                    value={formData.password}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
                <br /><br /><br />
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={submitted}
                >
                    {
                        (submitted && 'Your form is submitted!')
                        || (!submitted && 'Submit')
                    }
                </Button>
            </ValidatorForm>
         </div>
        );
    }
}