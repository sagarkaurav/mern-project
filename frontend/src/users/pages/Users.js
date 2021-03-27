import react, {useState} from 'react';
import User from '../components/User';

const Users = () => {
    const [users, _] = useState([{id: '1', name: 'Sagar Kaurav'}, {id: '2', name: 'John Doe'}]);
    return (
        <div className="grid grid-cols-1 gap-4 px-8 py-12 md:grid-cols-4 max-w-8xl">
            {users.map(user => <User key={user.id} id={user.id} name={user.name} />)}

        </div>
    );
}

export default Users;