import React from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import { Input, Button } from '../../atoms';

import './newsletter-signup.scss';

const DEFAULT_ERROR_MESSAGE = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es noch einmal.';

export class NewsletterSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      info: null,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ email: event.target.value.trim() });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.loading) {
      return;
    }
    if (!this.state.email) {
      this.setState({
        info: {
          type: 'error',
          message: 'Bitte E-Mail Adresse eintragen.',
        },
      });
      return;
    }
    try {
      this.setState({ loading: true });
      const { result, msg } = await addToMailchimp(this.state.email);
      if (result === 'error') {
        let message = DEFAULT_ERROR_MESSAGE;
        let type = 'error';
        if (msg === 'The email you entered is not valid.') {
          message = 'Diese E-Mail Adresse ist invalid.';
        } else if (msg.startsWith(`${this.state.email} is already subscribed to list Newsletter`)) {
          message = 'Diese E-Mail Adresse ist bereits registriert. Vielen Dank für deine Treue!';
          type = 'success';
        }
        this.setState({
          info: {
            type,
            message,
          },
        });
      } else {
        this.setState({
          info: {
            type: 'success',
            message: 'Besten Dank für Ihre Anmeldung!',
          },
          email: '',
        });
      }
    } catch (e) {
      this.setState({
        info: {
          type: 'error',
          message: DEFAULT_ERROR_MESSAGE,
        },
      });
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="newsletter-signup">
        <h4>Für unseren Newsletter anmelden:</h4>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="newsletter-email"
            value={this.state.email}
            type="email"
            placeholder="Email-Adresse eintragen"
            onChange={this.handleChange}
          />
          <Button
            text={this.state.loading ? 'Sende..' : 'Anmelden'}
            disabled={this.state.loading}
            onClick={this.handleSubmit}
          />
          <div
            className={`newsletter-signup__info-container ${
              this.state.info && this.state.info.type ? `newsletter-signup__info-container--${this.state.info.type}` : ''
            }`}
          >
            {this.state.info && this.state.info.message && this.state.info.message}
          </div>
        </form>
      </div>
    );
  }
}

export default NewsletterSignup;
