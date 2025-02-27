import { Alert, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Axios } from '../../api/axios';


  

export default  function Products() {
    const [products, setProducts] = useState([]);
    const [loading,setloading]=useState(false);
    const [submitted,setsubmitted]=useState(false);
    const [error,seterror]=useState(false);
  const getProducts = async () => {
    if(loading)return;// Prevent duplicate requests
      setloading(true);
      try {
        const response = await Axios.get(`/product/products`);
        console.log(products)
        setProducts((prev) => [...prev, ...response.data]); // Append new items
      
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setloading(false);
      }
    };         
         const saveProduct = async (id) => {
          try {
            const response = await Axios.post(`/product/like?id=${id}`);
      
            if (response.data === "error already liked that") {
              seterror(true);
              setTimeout(() => seterror(false), 1000);
            } else {
              setsubmitted(true);
              setTimeout(() => setsubmitted(false), 1000);
            }       
            console.log(response.data);
          } catch (error) {
            console.error("Error saving product:", error);
          }
        };
useEffect(()=>{
  getProducts();
},[])
  return<>
  <Alert style={{position:"absolute",top:15,display:!submitted?"none":"block",zIndex:5,width:150}} severity="success">Saved</Alert>
  <Alert style={{position:"absolute",top:15,display:!error?"none":"block",zIndex:5,width:150}} severity="error">  Already Liked</Alert>
  
   <Virtuoso style={{
    height: "90dvh",
    width: "90dvw"
  }} data={products} endReached={() => {
    console.log("Fetching more products...");
    getProducts();
  }} // Fetch more products on scroll
  overscan={20} // Preload extra items for smoother scrolling
  components={{
    Footer: () => loading && <CircularProgress size="30px" style={{
      display: "block",
      margin: "10px auto"
    }} />
  }} id='scrollableDiv' itemContent={index => {
    const startIndex = index * 4;
    const rowItems = products.slice(startIndex, startIndex + 4);
    return <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      width: "100%",
      flexWrap: "wrap"
    }}>
              {rowItems.map((p, i) => <Card key={p.id} sx={{
        width: 250,
        mb: 2,
        maxHeight: 450
      }}>
                  <CardMedia sx={{
          height: 140
        }} image={p.imageData} loading="lazy" title={p.price} />
                  <CardContent>
                    <Typography gutterBottom variant="p" component="div">
                      {p.price}
                    </Typography>
                    <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
                      {p.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      <a href={p.link}>Go to Product</a>
                    </Button>
                    <IconButton onClick={() => saveProduct(p.id)} size="small">
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </CardActions>
                </Card>)}
            </div>;
  }} />;
</>}
  