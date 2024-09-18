import "./Book.css";

import {
  CardActions,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
} from "@mui/material";

function Book() {
  return (
    <div>
      <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image="/img/yazar.jpg"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Canan Tan
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Türkiye
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Birtday
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
}

export default Book;
