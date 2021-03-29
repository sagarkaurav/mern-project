import react, { useReducer, useContext} from 'react';

import {useBackendApi} from '../../hooks/backendApi';
import  AuthContext from '../../context/AuthContext';
import {useHistory} from 'react-router-dom';


const FormDataReducer = (state, action) => {
    switch(action.type) {
        case 'change':
            let isValid = true;
            let errorMsg = '';
            for(let i = 0; i < state[action.id].validations.length; i++ ){
                let rule = state[action.id].validations[i];
                let ruleVali = rule(action.val);
                if(ruleVali.status ===false) {
                    isValid = false;
                    errorMsg = ruleVali.error;
                    console.log(errorMsg);
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
        default:
            return state
    }
    
}

const NewPlace = () => {
    const { isLoading, err, sendRequest } = useBackendApi();
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const [formData, dispatch] = useReducer(FormDataReducer, {
        'title': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'Title can not be empty'}: {status: true, error: ''}]
        },
        'description': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'Description can not be empty'}: {status: true, error: ''}, (val) => val.trim().length < 5 ? { status: false, error:'Description can not be less than 5 characters'}: { status: true, error:''}]
        },
        'address': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'Address can not be empty'}: {status: true, error: ''}]
        }
    });
    const newPlaceSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const respdata = await sendRequest('http://localhost:5000/api/v1/places', 'POST', JSON.stringify({
                title: formData.title.val,
                description: formData.description.val,
                address: formData.address.val
            }), {
                'content-Type': 'application/json',
                'Authorization': 'Bearer ' + authContext.token
            })
            history.push(`/${authContext.userId}/places`);
        } catch(err) {
            alert(err)
        }
    } 
    return (
        <div className="flex max-w-3xl p-8 mx-auto mt-12 bg-white rounded-lg shadow-sm">
            <form onSubmit={newPlaceSubmitHandler}>
                <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                        <span className={`text-gray-700 ${formData.title.isTouched && !formData.title.isValid ? 'text-red-400' :  ""}`  }>Name</span>
                        <input type="text" name="title" autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Place name"></input>
                        {formData.title.isTouched && !formData.title.isValid ? <span className="text-red-400">{formData.title.errorMsg}</span> :  ""}
                    </label>
                    <label className="block">
                        <span className={`text-gray-700 ${formData.address.isTouched && !formData.address.isValid ? 'text-red-400' :  ""}`  }>Address</span>
                        <input type="text" name="address" autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Address"></input>
                        {formData.address.isTouched && !formData.address.isValid ? <span className="text-red-400">{formData.address.errorMsg}</span> :  ""}
                    </label>
                    <label className="block">
                        <span className={`text-gray-700 ${formData.description.isTouched && !formData.description.isValid ? 'text-red-400' :  ""}`  }>Description</span>
                        <textarea name="description" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  placeholder="description" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="3"></textarea>
                        {formData.description.isTouched && !formData.description.isValid ? <span className="text-red-400">{formData.description.errorMsg}</span> :  ""}
                    </label>
                    <button type="submit" disabled={!(formData.title.isValid && formData.description.isValid && formData.address.isValid && !isLoading)}  className="px-2 py-2 text-white bg-green-300 rounded-md disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-green-500">{isLoading ? 'Adding new place...': 'Add new place'}</button>
                </div>
            </form>
        </div>
    );
}

export default NewPlace;