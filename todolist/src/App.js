import logo from './assets/skynet_logo.svg';

// Import react components
import { useState, useEffect } from 'react';

// Import App Component & helper
import Todo from './components/Todo';

// Import DAC
import { ContentRecordDAC } from '@skynetlabs/content-record-library';

// Import UI Components
import { Image, Container } from 'semantic-ui-react';

// Import the SkynetClient and a helper
import { SkynetClient } from 'skynet-js';

// const portal = window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
// const client = new SkynetClient(portal);

// Initiate the SkynetClient
const client = new SkynetClient();

// Intitate the ContentRecordDAC
const contentRecord = new ContentRecordDAC();

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [TodoList, setTodoList] = useState([]);
  const [TodoData, setTodoData] = useState([]);


  useEffect(() => {
    setNewTodo(newTodo)
  }, [newTodo]);

  //choose data domain for saving files in MySky
  const dataDomain = 'todolist';

  // On initial run, start initialization of MySky
  useEffect(() => {
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);


        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
          // load data from user
          const { data } = await mySky.getJSON(dataDomain);
          //set state for todo list
          if (data) {
            setTodoList(data)
            setTodoData(data)
            console.log(data)
          } else {
            console.error('There was a problem with getJSON');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    // call async setup function
    initMySky();
  }, []);

  const handleMySkyLogin = async () => {
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
      window.location.reload();
    }

  };

  const handleMySkyLogout = async () => {
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((newTodo.indexOf(' ') >= 0 &&
      (newTodo.match(/[^ ]/g) === null))
      || newTodo === "") {
      alert("Please don't leave blank");
    } else {
      console.log('input submitted');
      const todo = {
        id: TodoList.length + 1,
        title: newTodo,
        done: false
      };

      TodoList.push(todo);
      helperSetData(TodoList);
      setNewTodo('');
    }

  }

  const helperSetData = async (jsonData) => {
    setLoading(true);

    try {
      await mySky.setJSON(dataDomain, jsonData);
      await loadData();
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }

    setLoading(false);
  }

  const loadData = async () => {
    setLoading(true);
    console.log('Loading data from SkyDB');
    // Use getJSON to load the user's information from SkyDB
    const { data } = await mySky.getJSON(dataDomain);

    if (data) {
      setTodoData(data)
      console.log(data)
    } else {
      console.error('There was a problem with getJSON');
    }

    setLoading(false);
  }

  const handleCheckboxClick = function (id) {
    const TodoHelp = TodoList

    const index = TodoHelp.findIndex(todo => todo.id === id);
    TodoHelp[index].done = true;
    setTodoList(TodoList);
  }

  const handleDelete = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("deleting ...")

    helperSetData(TodoList);

    setLoading(false);
  }


  // define args passed to form
  const formProps = {
    mySky,
    handleSubmit,
    handleMySkyLogin,
    handleMySkyLogout,
    loading,
    loggedIn,
    userID,
    setLoggedIn,
    handleCheckboxClick,
    setNewTodo,
    newTodo,
    TodoList,
    handleDelete,
    TodoData
  };


  return (
    <Container >
      <Image src={logo} size="medium" centered></Image>
      <Todo {...formProps} />
    </Container>
  );
}

export default App;
