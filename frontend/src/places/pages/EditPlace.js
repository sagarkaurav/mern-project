import react, { useReducer, useContext, useEffect} from 'react';
import  {useParams} from 'react-router-dom';
import  AuthContext from '../../context/AuthContext';
import {useHistory} from 'react-router-dom';


import {useBackendApi} from '../../hooks/backendApi';

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

const EditPlace = () => {
    const { isLoading, err, sendRequest } = useBackendApi();
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const {placeId } = useParams();
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
        }
    });
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const respdata = await sendRequest(`${process.env.REACT_APP_BACKEND_API}/api/v1/places/${placeId}`);
                dispatch({id: 'title', val: respdata.place.title, type: 'change'})
                dispatch({id: 'description', val: respdata.place.description, type: 'change'})
            } catch(err) {
                alert(err)
            }            
        }
        fetchPlace();

    }, [dispatch, sendRequest, placeId]);
    const editPlaceSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const respdata = await sendRequest(`${process.env.REACT_APP_BACKEND_API}/api/v1/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formData.title.val,
                description: formData.description.val
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
            <form onSubmit={editPlaceSubmitHandler}>
                <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                        <span className={`text-gray-700 ${formData.title.isTouched && !formData.title.isValid ? 'text-red-400' :  ""}`  }>Name</span>
                        <input type="text" name="title" value={formData.title.val} autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Place name"></input>
                        {formData.title.isTouched && !formData.title.isValid ? <span className="text-red-400">{formData.title.errorMsg}</span> :  ""}
                    </label>
                    <label className="block">
                        <span className={`text-gray-700 ${formData.description.isTouched && !formData.description.isValid ? 'text-red-400' :  ""}`  }>Description</span>
                        <textarea name="description" value={formData.description.val} onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  placeholder="description" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="3"></textarea>
                        {formData.description.isTouched && !formData.description.isValid ? <span className="text-red-400">{formData.description.errorMsg}</span> :  ""}
                    </label>
                    <button type="submit" disabled={!(formData.title.isValid && formData.description.isValid && !isLoading)}  className="px-2 py-2 text-white bg-green-300 rounded-md disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-green-500">{isLoading ? 'Updating place...': 'Update Place'}</button>
                </div>
            </form>
        </div>
    );
}

export default EditPlace;