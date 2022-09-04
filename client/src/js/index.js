// Import modules
import  "./form";
import "./submit";

// Import CSS files
import "../css/index.css";

// Import bootstrap
import { Tooltip, Toast, Popover } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


// Import images
import Logo from "../images/logo.png";
import Bear from '../images/bear.png';
import Dog from '../images/dog.png';

// import initDb, getDb, and PostDB function
import { initDb, getDb, postDb } from './database';

window.addEventListener('load', function () {
  initDb();

    document.getElementById('logo').src = Logo;
    document.getElementById('bearThumbnail').src = Bear;
    document.getElementById('dogThumbnail').src = Dog;
  });