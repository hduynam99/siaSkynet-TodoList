import {
  Button,
  Form,
  Input,
  Header,
  Loader,
  Dimmer,
  Divider,
  Label,
  Grid,
  Container
} from 'semantic-ui-react';

// Todo is a simple form used for the Skynet Workshop
const Todo = (props) => {
  
  if (props.loggedIn === false) {
    return (
      <Container textAlign="center">
        <p>
          Please Login to use todo list style Skynet!
        </p>
        <Button color="green" onClick={props.handleMySkyLogin} >
          Login with MySky
        </Button>
      </Container>
    )
  } else if (props.loggedIn === null) {

    return (
      <Container textAlign="center">
        <Button>Loading MySky...</Button>
      </Container>
    )
  }

  return (
    <>
      <Container textAlign="center">

        <Dimmer active={props.loading}>
          <Loader active={props.loading} />
        </Dimmer>

        <Button onClick={props.handleMySkyLogout} color="green" >
          Log Out of MySky
          </Button>
        <Divider />

        <>
          <Header as="h4">MySky Todo List</Header>

          <Form inline>
            <Label pointing="right">
              User ID
              </Label>
            <Label>
              {props.userID}
            </Label>
          </Form>
          <Divider />
        </>

        <Grid columns={2} divided >
          <Grid.Row>
            <Grid.Column >
              <Form onSubmit={props.handleSubmit}>
                <Input
                  type="text"
                  placeholder="Todo"
                  value={props.newTodo}
                  onChange={(e) => {
                    props.setNewTodo(e.target.value);
                  }}
                />
                <br />
                <br />
                <Button basic color="green" type="submit">
                  Add to list
                </Button>
              </Form>
            </Grid.Column>

            <Grid.Column>
              <Form onSubmit={props.handleDelete} >
                {props.TodoData.filter(todo => !todo.done)
                  .map(todo => (
                    <div key={todo.id} className="field">
                      <div className="ui checkbox"
                        onClick={() => {
                          props.handleCheckboxClick(todo.id)
                        }}>
                        <input type="checkbox" />
                        <label>{todo.title}</label>
                      </div>
                    </div>
                  ))}
                <br />
                <br />
                <Button basic color="red" type="submit">
                  Delete from list
              </Button>
              </Form>
            </Grid.Column>

          </Grid.Row>
        </Grid>

      </Container>
    </>
  );
};

export default Todo;
