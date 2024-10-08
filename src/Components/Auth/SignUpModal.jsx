import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { auth } from '../../Firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import authSlice, { userSignIn } from '../../store/slices/authSlice.jsx';
import { getAuthErrorMessage } from '../utils';
import GoogleBtn from './GoogleBtn';

const SignUp = ({ show, onHide }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                toast.success('Login Successfully !')
                onHide()
                dispatch(userSignIn({ user }))
            }).catch((error) => {
                var errorCode = error.code
                var errorMessage = getAuthErrorMessage(errorCode);
                toast.error(errorMessage)
                console.log(error)
            })

    }

    // sign in google
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                toast.success('Login Successfully !')
                onHide()
                dispatch(userSignIn({ user }))
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                var errorCode = error.code
                var errorMessage = getAuthErrorMessage(errorCode);
                toast.error(errorMessage)
            });
    }

    return (
        <div>
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={signUp}>
                        <div className='sign-in-container d-flex justify-content-center align-items-center flex-column'>
                            {/* <h5>Sign-Up Now</h5> */}
                            <div className="row loginModalWrapper">
                                <div className="col-12">
                                    <div className="inputWrapper">
                                        <label htmlFor="Email">Email</label>
                                        <input type="email" placeholder='Enter your email' className='' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="inputWrapper">
                                        <label htmlFor="Password">Password</label>
                                        <input type="password" placeholder='Enter your password' className='' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="inputWrapper btnWrapper">
                                        <Button type='submit' className='mt-2 mb-2 fw-bold btn-danger' >Sign Up</Button>
                                    </div>
                                </div>
                                <div className="inputWrapper btnWrapper">
                                   <GoogleBtn signInWithGoogle={signInWithGoogle}/>
                                </div>
                            </div>



                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SignUp;
