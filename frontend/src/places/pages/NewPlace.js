import react, {useCallback, useReducer} from 'react';

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
    const [formData, dispatch] = useReducer(FormDataReducer, {
        'name': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'Name can not be empty'}: {status: true, error: ''}, (val) => val.trim().length < 5 ? { status: false, error:'Name can not be less than 5 characters'}: { status: true, error:''}]
        },
        'description': {
            val: '',
            isValid: false,
            touched: false,
            errorMsg: '',
            validations: [(val) => val.trim().length === 0 ? {status: false, error: 'Description can not be empty'}: {status: true, error: ''}, (val) => val.trim().length < 5 ? { status: false, error:'Description can not be less than 5 characters'}: { status: true, error:''}]
        }
    });
    const newPlaceSubmitHandler = (e) => {
        e.preventDefault();
    } 
    return (
        <div className="flex max-w-3xl p-8 mx-auto mt-12 bg-white rounded-lg shadow-sm">
            <form onSubmit={newPlaceSubmitHandler}>
                <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                        <span className={`text-gray-700 ${formData.name.isTouched && !formData.name.isValid ? 'text-red-400' :  ""}`  }>Name</span>
                        <input type="text" name="name" autoComplete="off" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Place name"></input>
                        {formData.name.isTouched && !formData.name.isValid ? <span className="text-red-400">{formData.name.errorMsg}</span> :  ""}
                    </label>
                    <label className="block">
                        <span className={`text-gray-700 ${formData.description.isTouched && !formData.description.isValid ? 'text-red-400' :  ""}`  }>Description</span>
                        <textarea name="description" onChange={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})} onBlur={(e) => dispatch({id: e.target.name, val: e.target.value, type: 'change'})}  placeholder="description" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="3"></textarea>
                        {formData.description.isTouched && !formData.name.isValid ? <span className="text-red-400">{formData.description.errorMsg}</span> :  ""}
                    </label>
                    <button>Add new place</button>
                </div>
            </form>
        </div>
    );
}

export default NewPlace;