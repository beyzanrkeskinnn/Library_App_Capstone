import "./Home.css";
import {
  styled,
  Container,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material/";

function Home() {
  const Div = styled("div")(({ theme }) => ({
    ...theme.typography.button,
  }));

  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 5, pb: 5 }}>
        <div className="home-section">
          <div className="welcome">
            <Box sx={{ width: "100%", maxWidth: 1000 }}>
              <Div>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "900", textAlign: "left" }}
                >
                  Your library is at your fingertips
                </Typography>
              </Div>

              <Typography
                variant="body2"
                sx={{ textAlign: "left", marginTop: "20px" }}
              >
                This library app offers the most practical way to discover and
                manage information. We hope you have a pleasant and productive
                development process!”
              </Typography>
              <Stack spacing={2} direction="row" sx={{ pt: "10px" }}>
                <Button variant="contained" sx={{ backgroundColor: "#d47a33" }}>
                  Get Started
                </Button>
                <Button variant="text" sx={{ color: "#d47a33" }}>
                  Learn More
                </Button>
              </Stack>
            </Box>
          </div>
          <div className="img">
            <img src="./img/home_book.png" alt="Home Book" />
          </div>
        </div>
      </Container>

      <div className="home-services">
        <Container
          maxWidth="lg"
          className="home-services-container"
          sx={{ pt: 5, pb: 5, borderRadius: 10, mt: 5 }}
        >
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="nowrap"
            justifyContent="center"
            gap={5}
          >
            <Box flex="1 1 100%" sm="1 1 45%" md="1 1 30%" textAlign="center">
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                300+
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Coded Elements
              </Typography>
              <Typography variant="body2" color="textSecondary">
                From buttons, to inputs, navbars, alerts or cards, you are
                covered.
              </Typography>
            </Box>

            {/* Second Stat */}
            <Box flex="1 1 100%" sm="1 1 45%" md="1 1 30%" textAlign="center">
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                100+
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Design Blocks
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Mix the sections, change the colors and unleash your creativity.
              </Typography>
            </Box>

            {/* Third Stat */}
            <Box flex="1 1 100%" sm="1 1 45%" md="1 1 30%" textAlign="center">
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                41
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Pages
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Save 3-4 weeks of work when you use our pre-made pages for your
                website.
              </Typography>
            </Box>
          </Box>
        </Container>
        <Container
          maxWidth="lg"
          className="home-services-container2"
          sx={{ pt: 5, pb: 5 }}
        >
          <Box>
            <Typography variant="h5" color="white">
              OUR SERVICES
            </Typography>
            <Box>
              <Typography variant="body2">Yazar Yönetim </Typography>
              <Typography variant="body2">Category Yönetim </Typography>
              <Typography variant="body2">Kitap Yönetim </Typography>
              <Typography variant="body2">Yayımcı Yönetim </Typography>
              <Typography variant="body2">Kitap alma Yönetim </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Home;
