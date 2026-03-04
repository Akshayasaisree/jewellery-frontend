import React, { useState } from 'react';
import Title from '../components/Title';
import contact from '../assets/contact.webp';

const Contact = () => {
  // State to store the phone number input
  const [phoneNumber, setPhoneNumber] = useState('');
  const token = localStorage.getItem('token');
  // Function to handle form submission
  const submitContact = async () => {
    const token = localStorage.getItem('token');

    if (!phoneNumber) {
      console.log('Please enter your phone number');
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        window.alert('Contact information submitted');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="my-10 flex justify-center md:flex-row gap-10 mb-28">
        <img src={contact} alt="Contact us" className="w-full md:max-w-480px" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="text-2xl font-medium text-gray-800">
            Give us your number, our team will contact you soon
          </p>
          {/* Input for phone number */}
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Mobile number"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} // Update state on input change
          />
          {/* Submit button */}
          {/* <button
            className="bg-black text-white font-light px-8 py-2 mt-4"
            onClick={submitContact} // Call submitContact on button click
          >
          
            Submit
          </button> */}
          <button
          className="bg-black text-white font-light px-8 py-2 mt-4"
          onClick={submitContact}
          disabled={!token}
          style={{
            cursor: token ? 'pointer' : 'not-allowed'
          }}
        >
          Submit
        </button>
          
        </div>
      </div>
    </div>
  );
};

// Error boundary component for error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default Contact;
