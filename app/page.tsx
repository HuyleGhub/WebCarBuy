
import Navbar from "./components/Navbar";
import BackgroundSlider from "./components/BackgroundSlide";
import Product from "./components/Product";
import Videobg from "./components/Videobg";
import Information from "./components/Information";
import Footer from "./components/Footer";
import CozeChat from "./components/CozeAi";




export default function Home() {
  return (
    <div >
         <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <Videobg></Videobg>
      <Information></Information>
      <CozeChat/>
      <Footer></Footer>
    </div>
  );
}
