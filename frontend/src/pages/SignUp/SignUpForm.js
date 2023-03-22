import React, { useState } from 'react';
import './SignUpForm.css';

const SignUpForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [userType, setUserType] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0]);
        if (event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
        } else {
            setPreviewImage(null);
        }
    };

    const validatePassword = () => {
        const regex = /^(?=(?:.*[a-zA-Z]){4,})(?=(?:.*\d){2,}).{6,}$/;
        if (!regex.test(password)) {
            setErrorMessage(
                'Password must be at least 6 characters long and contain at least 2 digits.'
            );
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validatePassword()) {
            // TODO: Implement the sign-up logic
        }
    };

    return (
        <div className="sign-up-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first-name-input">First Name</label>
                <input
                    id="first-name-input"
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                />

                <label htmlFor="last-name-input">Last Name</label>
                <input
                    id="last-name-input"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                />

                <label htmlFor="email-input">Email</label>
                <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="password-input">Password</label>
                <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <label htmlFor="confirm-password-input">Confirm Password</label>
                <input
                    id="confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />

                <label htmlFor="profile-picture-input">Upload Profile Picture</label>
                <input
                    id="profile-picture-input"
                    type="file"
                    onChange={handleProfilePictureChange}
                />

                {previewImage && (
                    <div className="profile-picture-preview">
                        <img src={previewImage} alt="Profile Preview" />
                    </div>
                )}

                <label htmlFor="user-type-select">User Type</label>
                <select
                    id="user-type-select"
                    value={userType}
                    onChange={(event) => setUserType(event.target.value)}
                    required
                >
                    <option value="">Select a user type</option>
                    <option value="Student">Student</option>
                    <option value="Employer">Employer</option>
                    <option value="Admin">Admin</option>
                </select>

                <button className="sign-up-button" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;
