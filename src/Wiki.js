import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios'
import {  TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import HistoryIcon from '@mui/icons-material/History';


const Wiki = () => {

 const [loading,setLoading]=useState(false)
 const [search,setSearch]=useState('') 
 const[result,setResult]=useState([])
 const[noResults,setNoResults]=useState(false)
 const [isClicked, setClicked] = useState([]);
  console.log({isClicked})
 const [icon, setIcon] = useState(<FavoriteIcon />);
 const [savedResults, setSavedResults] = useState(
  JSON.parse(localStorage.getItem('savedResults')) || []
);
console.log(savedResults)
 const [open, setOpen] = useState(false);
 const handleOpen = () => setOpen(true);
 const handleClose = () => setOpen(false);
 const Search=async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
         const url=`https://en.wikipedia.org/w/api.php?action=query&list=search&
         prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${search}`;
         const resp= await axios(url)
          console.log({resp})
         if( search.length >2  ){
            setResult(resp.data.query.search)
            setTimeout(()=>{
              setLoading(false)           
            },500)
            setClicked(true);
              if (resp.data.query.searchinfo.totalhits === 0){
                  setNoResults(true)
              } else {
                  setNoResults(false)
              }       
            }
        } catch (error) {
          console.log(error)
        }
  }

  useEffect(() => {
    localStorage.setItem('savedResults', JSON.stringify(savedResults));
  }, [savedResults]);

  function handleClick(item) {
    setSavedResults([...savedResults, item]);
  }
   useEffect(()=>{
    Search()
  },[])

  return (
    <div className='container'>
    
       <h3> Wiki-Search</h3>
    
    <form  onChange={Search}>
       <div className='section'>

         <TextField  
         className='search'     
         value={search}
         onChange={e=>setSearch(e.target.value)}
         type='text'
         size='small'
         placeholder='Search'/>
         <button className='search-button'  onClick={Search} variant='outlined' ><SearchIcon/></button>
      
       <button className='history-button' onClick={(e)=>handleOpen(e.preventDefault())}><HistoryIcon/></button>
         <Modal  
               open={open}
               onClose={handleClose}
            >
          <div  className='history-page' >
             <div>
               <h2> Saved Results</h2>
              </div>
               {savedResults.map((result) => (
                 <div className='history-item' key={result.pageid}>
                  <h5 className='history-text'>{result.title}</h5>
                  <a className='history-button' href={`https://en.wikipedia.org/?curid=${result.pageid}`}>Read more... </a> 
                </div>
              ))}
              </div>
           </Modal>
           <div>
       </div>
      </div>
     

    </form> 
     { noResults ?( <div className='loading'> Nothing found! Please search another thing.</div>):(
     <div className='section-result'>
        {loading &&<p ><CircularProgress /></p> }
       {result.map((item)=>{
          const pageid= `https://en.wikipedia.org/?curid=${item.pageid}` 
       return(

         <div key={item.pageid} className='item'>
          {/* {console.log({noResults})} */}
         <>   
           <div className='title'>{item.title}</div>
           <p dangerouslySetInnerHTML={{ __html:item.snippet}}></p>
           <div className='endof-item'>
             <a className='link' href={pageid}>Read more... </a> 
             <button  type='button' className='buttonn'onClick={() =>{handleClick(item);isClicked(item)}}>
            {isClicked? (<FavoriteBorderIcon/>):(<FavoriteIcon/>)} 
         
             </button>
            
           </div>
         </>
         </div>
       )
       })} 
     </div>
       )} 
    </div>
  )
}

export default Wiki
