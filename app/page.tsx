
import Navbar from "./components/Navbar";
import BackgroundSlider from "./components/BackgroundSlide";
import Product from "./components/Product";
import Videobg from "./components/Videobg";
import Information from "./components/Information";
import Footer from "./components/Footer";




export default function Home() {
  return (
    <div >
      <Navbar></Navbar>
      <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <Videobg></Videobg>
      <Information></Information>
      <Footer></Footer>
       
    </div>
  );
}
