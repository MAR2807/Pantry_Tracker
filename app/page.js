'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, AppBar, Toolbar, Button, IconButton, TextField, Modal } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import { firestore } from '@/firebase';
import { collection, deleteDoc, getDocs, query, doc, getDoc,setDoc } from 'firebase/firestore'; // Import query here
import {Camera, takePhoto} from "react-camera-pro";
import { BorderLeft } from '@mui/icons-material';

const initialItems = [
  'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato', 'tomato',
];



const ListStyle = {
    color: 'black',
    width: '100%',
    padding: '10px', 
    listStyleType: 'none', 
  
};

const listItemStyle = {
  bgcolor: "#5865f2",
  display: 'flex',
  justifyContent: 'space-between', // Distribute space between item details and delete button
  alignItems: 'center',
  padding: '10px',
 
  borderRadius:"10px",
  boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
  marginTop:"20px"
  
};

const bar = {
  width: '100vw',
  
};

const scrollContainerDefault = {
  // boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
  // bgcolor: "#5865f2",
  marginTop: '20px',
  borderRadius: '10px',
  maxHeight: '400px',
  width: '100%',
  overflowY: 'auto',
  padding: '20px',
  // borderBottom: '1px solid #5865f2',
  scrollbarWidth: 'thin', // For Firefox
  scrollbarColor: '#5865f2 transparent', // For Firefox

  '@media (max-width: 600px)': {
    maxHeight: '300px', // Adjust max height for smaller screens
    maxWidth: '200px', // Further adjust max width for even smaller screens
    padding: '8px', // Adjust padding for smaller screens
    marginLeft: '-30px', // Move more to the left
  },
  '@media (max-width: 400px)': {
    maxHeight: '400px', // Further adjust max height for even smaller screens
    maxWidth: '200px', // Further adjust max width for even smaller screens
    padding: '5px', // Further adjust padding for even smaller screens
    marginLeft: '-40px', // Move even more to the left
  },
  '@global':{
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px', // Add border-radius to the track
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#5865f2',
    borderRadius: '20px', // Add border-radius to the thumb
  },
}
}; 
const scrollContainerSmall = {
  boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
  bgcolor: "#5865f2",
  marginTop: '100px',
  borderRadius: '10px',
  maxHeight: '300px',
  width: '100%',
  overflowY: 'auto',
  padding: '20px',
  // borderBottom: '1px solid #5865f2',
  scrollbarWidth: 'thin', // For Firefox
  scrollbarColor: '#5865f2 transparent', // For Firefox

  '@media (max-width: 600px)': {
    maxHeight: '300px', // Adjust max height for smaller screens
    maxWidth: '200px', // Further adjust max width for even smaller screens
    padding: '8px', // Adjust padding for smaller screens
    marginLeft: '-30px', // Move more to the left
  },
  '@media (max-width: 400px)': {
    maxHeight: '400px', // Further adjust max height for even smaller screens
    maxWidth: '200px', // Further adjust max width for even smaller screens
    padding: '5px', // Further adjust padding for even smaller screens
    marginLeft: '-40px', // Move even more to the left
  },
  '@global':{
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px', // Add border-radius to the track
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#5865f2',
    borderRadius: '20px', // Add border-radius to the thumb
  },
}
};// Smaller height when searching

const scroll = {
  height: '100%', // Make sure it fills the container
  scrollbarWidth: 'thin', // For Firefox
  scrollbarColor: '#5865f2 transparent', // For Firefox
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0px',
  ml: '20px',
};
const midBox = {
  height:"400px",
  marginTop:"-60px",
  display:"flex",
  justifyContent:"center" ,
  alignItems:"center",
  width:"100%" ,
  maxWidth:"800px",
  '@media (max-width: 600px)': {
    padding: '15px', // Adjust padding for smaller screens
    marginLeft: '-20px', // Move more to the left
  },
  '@media (max-width: 400px)': {
    padding: '10px', // Further adjust padding for even smaller screens
    marginLeft: '-40px', // Move even more to the left
  },

};


const CSStextfield = {

  boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
  marginLeft:"100px",
  bgcolor: "#5865f2",
  width: '500px',
  borderRadius: '10px',
  '& .MuiFormLabel-root': {
    color: 'black',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'yellow',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'grey',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5865f2',
    },
  },
  '@media (max-width: 600px)': {
    width: '150px', // Adjust width for smaller screens
    marginLeft: '-20px', // Move more to the left
  },
  '@media (max-width: 430px)': {
    width: '150px', // Further adjust width for even smaller screens
    marginLeft: '-60px', // Move even more to the left
  },
  '@media (max-width: 400px)': {
    width: '100px', // Further adjust width for even smaller screens
    marginLeft: '-50px', // Move even more to the left
  },
  '@media (max-width: 375px)': {
    width: '100px', // Further adjust width for even smaller screens
    marginLeft: '-60px', // Move even more to the left
  },


};

const CSSSearchField = {

  boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
  marginLeft:"100px",
  bgcolor: "#5865f2",
  width: '500px',
  marginTop: '20px',
  borderRadius: '10px',
  bgcolor: "#5865f2",
  '& .MuiFormLabel-root': {
    color: 'black',
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'yellow',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'grey',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5865f2',
    },
  },
  '@media (max-width: 600px)': {
    width: '150px', // Adjust width for smaller screens
    marginLeft: '-20px', // Move more to the left
  },
  '@media (max-width: 430px)': {
    width: '150px', // Further adjust width for even smaller screens
    marginLeft: '0px', // Move even more to the left
  },
  '@media (max-width: 400px)': {
    width: '100px', // Further adjust width for even smaller screens
    marginLeft: '0px', // Move even more to the left
  },
  '@media (max-width: 375px)': {
    width: '100px', // Further adjust width for even smaller screens
    marginLeft: '0px', // Move even more to the left
  },
}


export default function Home() {


const camera = useRef(null);
const [numberOfCameras, setNumberOfCameras] = useState(0);
const [image, setImage] = useState(null);
const [isCameraOn, setIsCameraOn] = useState(false);
const [items, setItems] = React.useState(initialItems);
const [name, setName] = React.useState("");
const [inventory, setInventory] = useState([])
const [searchQuery, setSearchQuery] = useState('');



  const updateInventory = async () =>{
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
      updateInventory();
    }
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };




 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length < 30){
      if (name.trim()) {
        // Call addItem with the trimmed name
        await addItem(name.trim().toLowerCase());
        setName(''); // Clear the input field
      }
    }else{
      alert("Item name is too long");
    }

  };
 
  const itemFormat = (string) =>{
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleCapturePhoto = async () => {
    const photo = camera.current.takePhoto();
    setImage(photo);

    const formData = new FormData();
    formData.append('file', photo, 'image.jpg');

    try {
      const response = await fetch('http://localhost:5000/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Item identified:', data.itemName);
        await addItem(data.itemName);
      } else {
        console.error('Failed to identify item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    
    <Box backgroundColor="#28282B"
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={'column'}
       padding={" xs: 2, sm: 3 "}>
     
      <Box sx={bar}>
        <AppBar position="static" sx={{ flexGrow: 1, bgcolor: "transparent", color: "#5865f2", boxShadow:"none"}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Typography variant="h4" 
      component="div" 
      sx={{ padding:"20px", 
        borderRadius: "20px",
        textAlign: "center",
        width: "80%",
        boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
        bgcolor: "#5865f2",
        color:"", flexGrow: 1 }}>
      Pantry Tracker
      </Typography>
      <Box
        width="100vw"
        height="100vh"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={'column'}
      >
<Box width='100%' height="300px" paddingLeft={"20px"} maxWidth={"800px"} >
          {/* <Typography bgcolor={"#5865f2"} marginTop={"20px"}marginRight={"40px"} borderRadius = "20px" padding={"20px"}variant={'h4'} color={'black'} textAlign={'center'}>
              Pantry Items
          </Typography> */}
          {/* <Button variant="contained" sx={{marginLeft:"20px",':hover': {
        bgcolor: '#5865f2', 
        color: 'white',
        }, color:"black",bgcolor: "#5865f2", ml:78, mt:3, borderRadius:"50px", width:"70px", height:"70px"}} onClick={() => {
        if (isCameraOn == false)
          {
            setIsCameraOn(true)
          }
          else{
            setIsCameraOn(false)
          }

        }}><Typography sx={{ textTransform: 'none' }} variant='p'>Camera</Typography></Button> */}
          <Box marginBottom={"0px"}
            component="form"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              mt: 5,
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit} // Handle form submission
          >
            <TextField
              sx={CSStextfield}
              color="warning"
              id="outlined-controlled"
              label="Enter Item"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />


            <Button type="submit"  color="primary" 
            sx={{ 
            bgcolor: "#5865f2",
            color:"black",
              ':hover': {
            bgcolor: '#5865f2', 
            color: 'white',
            borderRadius: '10px',
            }, 
         
            borderRadius: '10px',
            boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px", 
            '@media (max-width: 600px)': {
              padding: '8px 16px', // Adjust padding for smaller screens
              marginLeft: '-40px', // Move more to the left
            },
            '@media (max-width: 430px)': {
              padding: '6px 12px',  // Further adjust width for even smaller screens
              marginLeft: '-60px', // Move even more to the left
            },
            '@media (max-width: 400px)': {
              padding: '6px 12px', // Further adjust padding for even smaller screens
              marginLeft: '-50px', // Move even more to the left
            },
            '@media (max-width: 375px)': {
              padding: '6px 12px', // Further adjust width for even smaller screens
              marginLeft: '-60px', // Move even more to the left
            },
            ml: { sm: 2 }, mt: { xs: 2, sm: 0 
              
            }}}>
            Add Item
            </Button>


        </Box>


        <TextField
              sx={CSSSearchField}
              color="warning"
              id="outlined-search"
              label="Search Items"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />



        




      </Box>

      <Box  sx={midBox} >

      <Box sx={searchQuery ? scrollContainerSmall : scrollContainerDefault}>
        <Box sx={scroll}>
          <Box sx={ListStyle} aria-label="inventory items">
            {inventory.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <React.Fragment key={item.name}>
                <Box sx={listItemStyle}>
                  <Box>
                    <Typography>{itemFormat(item.name)}</Typography>
                    <Typography sx={{ color: 'black', paddingBottom: "22px" }}>
                      Quantity: {item.quantity}
                    </Typography>
                  </Box>
                  <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.name)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
        </Box>






{/* camera component for integration with llama to identify items, ignore for now not functional yet :( */}
{isCameraOn && (
 
   <Box position="absolute" width="100%" maxWidth="640px" height="auto" marginBottom={"100px"}>
 
          <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} aspectRatio={16 / 9} style={{ width: '100%', height: 'auto' }} />
         
          <Button
            onClick={handleCapturePhoto}
            variant='contained'
            color="primary"
            sx={{ mt: { xs: 4, sm: 3, md: 2, lg: 1 } }}
          >
            Take Photo

          </Button>

          <button
            hidden={numberOfCameras <= 1}
            onClick={() => {
              camera.current.switchCamera();
            }}
            style={{
              position: 'absolute',
              top: 50,
              right: 10,
              backgroundColor: '#5865f2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              zIndex: 10 
            }}
          >
            Switch Camera
          </button>

          {image && <img src={image} alt='Image preview' style={{ marginTop: '20px', width: '100%', maxWidth: '640px' }} />}
        </Box> 
      
      )}
    </Box>

      </Box>
  );
}

