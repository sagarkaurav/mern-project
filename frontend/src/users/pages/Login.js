import react, {useState, useReducer, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useBackendApi } from '../../hooks/backendApi';


const FormDataReducer = (state, action) => {
    let isValid = true;
    let errorMsg = '';
    for(let i = 0; i < state[action.id].validations.length; i++ ){
        let rule = state[action.id].validations[i];
        let ruleVali = rule(action.val);
        if(ruleVali.status ===false) {
            isValid = false;
            errorMsg = ruleVali.error;
            break;
        }
    }
    return {
        ...state,
        [action.id]: {
            ...state[action.id],
            val: action.val,
            isValid: isValid,
            errorMsg: errorMsg,
            isTouched: true,
        }
    }
}

const Login = () => {
    const authContext = useContext(AuthContext);
    const  {isLoading, err, sendRequest} = useBackendApi();
    const history = useHistory();
    const [formData, dispatch] = useReducer(FormDataReducer, {
        'email': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'email can not be empty'}: {status: true, error: ''}]
        },
        'password': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'password can not be empty'}: {status: true, error: ''}]
        }
    });
    const newLogin = async (e) => {
        e.preventDefault();
        try{
            const resData =  await sendRequest('http://localhost:5000/api/v1/users/login',  'POST',JSON.stringify({
                email: formData.email.val,
                password: formData.password.val
            }),{ 'content-Type': 'application/json'});
            authContext.login(resData.user.name, resData.user.id, resData.user.token);
            history.push('/users');
        }
        catch(err){
            alert(err.message);
        }
    } 
    return (
        <div className="flex max-w-3xl p-8 mx-auto mt-12 bg-white rounded-lg shadow-sm">
            <form disabled={isLoading} onSubmit={newLogin}>
                <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                        <span className={`text-gray-700 ${formData.email.isTouched && !formData.email.isValid ? 'text-red-400' :  ""}`  }>Email</span>
                        <input type="email" name="email" autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="john@example.com"></input>
                        {formData.email.isTouched && !formData.email.isValid ? <span className="text-red-400">{formData.email.errorMsg}</span> :  ""}
                    </label>
                    <label className="block">
                        <span className={`text-gray-700 ${formData.password.isTouched && !formData.password.isValid ? 'text-red-400' :  ""}`  }>Password</span>
                        <input type="password" name="password" autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" ></input>
                        {formData.password.isTouched && !formData.password.isValid ? <span className="text-red-400">{formData.password.errorMsg}</span> :  ""}
                    </label>
                    <button type="submit" disabled={!(formData.password.isValid && formData.email.isValid && !isLoading)}  className="px-2 py-2 text-white bg-green-300 rounded-md disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-green-500">{isLoading ? 'Loging in....': 'Login'}</button>
                </div>
            </form>
        </div>
    );
}

export default Login;