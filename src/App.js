import React, {useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db,auth} from './firebase';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
const useStyles = makeStyles((theme) => ({
  paper:{
    position:'absolute',
    width:400,
    backgroundColor: theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[5],
    padding:theme.spacing(2,4,3),
  },
}));

function getModalStyle() {
  const top=50;
  const left=50;
  return{
    top:`$(top)%`,
    left:`$(left)%`,
    transform:`translate(-$(top)%,-$(left)%)`,
  };
}
function App() {
  const [modalStyle]= useState(getModalStyle);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open,setOpen]= useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user,setUser] = useState(null);
  const [openSignIn,setOpenSignIn] = useState(false);

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        //use has logged in
        console.log(authUser);
        setUser(authUser);
        
      }else{
        //user Logged out
        setUser(null);
      }
    })
    return () =>{
      unsubscribe();
    }
  },[username,user]);
  //useeffect runs a piece of code based on condition
  useEffect(()=>{
    db
    .collection('posts')
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot=>{
        setPosts(snapshot.docs.map(doc=>({
          id:doc.id,
          post:doc.data()
        })));
    })


  },[]);
  const signUp =(event) =>{
    event.preventDefault();
    
    auth.createUserWithEmailAndPassword(email,password)
        .then((authUser) =>{
          return authUser.user.updateProfile({
            displayName:username,
          })
        })
        .catch((error) =>alert(error.message));
        setOpen(false);
  }

  const signIn = (event) =>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));
    setOpenSignIn(false);
    
  }

  return (
    <div className="App">
      
      <Modal
          open={open}
          onClose={() =>setOpen(false)}
          
        >
          
          
          <div style={modalStyle} className={classes.paper} >
            <form className="app__signup">
              <center>
                <img 
                  className="app__headerImage"
                  src="https://th.bing.com/th/id/R5cdb4191426f52fdcc8bbdf57f53cdc2?rik=2pyUZ%2bIBUGzt%2fg&riu=http%3a%2f%2fstyle-matters.com%2fblog%2fwp-content%2fuploads%2f2013%2f01%2fInstagram_Logo_Large.png&ehk=2T1VinB7XitJ1%2b%2b8ITzofd%2bWmYr11ObKU97sSF%2bgQIg%3d&risl=&pid=ImgRaw"
                  alt=""
                /> 
              </center>
                <Input 
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input 
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange = {(e) => setEmail(e.target.value)}
                  
                
                />
                <Input 
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange = {(e) => setPassword(e.target.value)}
                  
                
                />
                  <Button onClick={signUp}>Sign Up</Button>
                
              </form>
          </div>
          
        </Modal>
        
        {/*  Sign in Modal */}

        <Modal
          open={openSignIn}
          onClose={() =>setOpenSignIn(false)}
          
        >
          
          
          <div style={modalStyle} className={classes.paper} >
            <form className="app__signup">
              <center>
                <img 
                  className="app__headerImage"
                  src="https://th.bing.com/th/id/R5cdb4191426f52fdcc8bbdf57f53cdc2?rik=2pyUZ%2bIBUGzt%2fg&riu=http%3a%2f%2fstyle-matters.com%2fblog%2fwp-content%2fuploads%2f2013%2f01%2fInstagram_Logo_Large.png&ehk=2T1VinB7XitJ1%2b%2b8ITzofd%2bWmYr11ObKU97sSF%2bgQIg%3d&risl=&pid=ImgRaw"
                  alt=""
                /> 
              </center>
              
                <Input 
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange = {(e) => setEmail(e.target.value)}
                  
                
                />
                <Input 
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange = {(e) => setPassword(e.target.value)}
                  
                
                />
                  <Button onClick={signIn}>Sign In</Button>
                
              </form>
          </div>
          
        </Modal>
        

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://th.bing.com/th/id/R5cdb4191426f52fdcc8bbdf57f53cdc2?rik=2pyUZ%2bIBUGzt%2fg&riu=http%3a%2f%2fstyle-matters.com%2fblog%2fwp-content%2fuploads%2f2013%2f01%2fInstagram_Logo_Large.png&ehk=2T1VinB7XitJ1%2b%2b8ITzofd%2bWmYr11ObKU97sSF%2bgQIg%3d&risl=&pid=ImgRaw"
          /> 

           {user ? (<Button onClick={() => auth.signOut() }>Logout</Button>)
      :(<div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>)
      
      }
      </div>
     
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id,post}) =>(
              <Post 
                    key={id}
                    postId={id}
                    user={user}
                    username={post.username} 
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                    />

            ))
          }
        </div>
        <div className="app__postsRight">
          
            {/* <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
              clientAccessToken='123|456'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
          /> */}
        </div>
      </div>
     {user?.displayName ?
      (<ImageUpload username={user.displayName}/>)
      :(<h3>Sorry you need to login to upload</h3>)
      }


      
      
    </div>
  );
}

export default App;
