
import Navbar from "./components/Navbar";
import BackgroundSlider from "./components/BackgroundSlide";
import Product from "./components/Product";
import Videobg from "./components/Videobg";
import Information from "./components/Information";
import Footer from "./components/Footer";
import CozeChat from "./components/CozeAi";
import Itemslide from "./components/ItemSlide";
import CarViewerPage from "./components/Car360";
import TechnicalSpecs from "./components/ThongSo";



export default function Home() {
  return (
    <div >
      <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <CarViewerPage/>
      <TechnicalSpecs/>
      <Videobg></Videobg>
      <Information></Information>
      <Itemslide/>
      <CozeChat/>
      <Footer></Footer>
    </div>
  );
}
