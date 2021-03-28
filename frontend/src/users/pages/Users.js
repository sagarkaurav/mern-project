import react, {useState,  useEffect } from 'react';
import User from '../components/User';
import { useBackendApi } from '../../hooks/backendApi';

const Users = () => {
    const [users, setUsers] = useState([]);
    const  {isLoading, err, sendRequest} = useBackendApi();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const respdata = await sendRequest('http://localhost:5000/api/v1/users');
                setUsers(oldUsers => respdata.users);
            }
            catch(err) {
                alert(err.message);
            }
        };
        fetchUsers();
    }, [sendRequest]);
    return (
        <div className="grid grid-cols-1 gap-4 px-8 py-12 md:grid-cols-4 max-w-8xl">
            {users.map(user => <User key={user.id} id={user.id} places={user.places} name={user.name} />)}

        </div>
    );
}

export default Users;