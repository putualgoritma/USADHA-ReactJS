import React, { Fragment, useEffect, useState } from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FaArrowCircleLeft, FaCartArrowDown, FaCoins, FaExchangeAlt, FaMoneyBillAlt, FaPlusCircle, FaSignInAlt, FaUserAlt } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { Spinner } from '..';
import { iconHistory, logo, iconUser, iconCart} from '../../assets';
function Header() {
      const [USER, setUSER] = useState(null)
      const [select, setSelect] = useState('home');
      const [lengthCart, setLengthCart] = useState(0)
      const currentURL = window.location.pathname;
      const history = useHistory()
      const [loading, setLoading] = useState(false);
      const width  = window.innerWidth;
      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) { 
                  getUSER();
                  getCART();
           }
            return () => {
                  isAmounted = true;
            }
      }, [])

      const getUSER = () => {
            let data =  sessionStorage.getItem('USER')
            data = JSON.parse(data)
            setUSER(data)
            
      }

      const getCART = async () => {
            let data = await sessionStorage.getItem('CART')
            data = JSON.parse(data)
            if(data){
                  setLengthCart(data.length)
           }
      }

      const logout = () => {
            setLoading(true)
            Promise.all([sessionStorage.removeItem('USER'),  sessionStorage.removeItem('TOKEN')]).then((result) => {
                  setTimeout(function () {
                        setLoading(false)
                        history.push('/login')
                    }, 2000); 
            }).catch((e) => {
                  setLoading(false)
                  alert('logout failed')
            })  
      }

      
      if(loading){
            return (
                  <Spinner/>
            )
      }

      return (
            <Fragment>
                  <Navbar expand="lg" className='navbar-custom'>
                        <Navbar.Brand href="/" className='navbar-logo'><img src={logo}   alt='img-header'/></Navbar.Brand>
                        {width <= 415 &&   <Nav.Link href='/cart' className='navbar-menu-right box-icon-profile'><img src={iconCart} alt='img-header' className = 'img-icon'/><span className='badge badge-danger position-absolute img'>{lengthCart}</span></Nav.Link>}
                        {width <= 415 &&   
                              <NavDropdown title={<img src={iconUser} alt='img-header' className='img-icon'/>} id="basic-nav-dropdown" className='navbar-menu-right box-icon-profile'>
                                    <NavDropdown.Item className={currentURL ==='/profile' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/profile"><FaUserAlt className='mr-1'/>{USER === null ? 'Profile' : USER.name} <hr/></NavDropdown.Item>
                                    {USER === null ? <NavDropdown.Item className={currentURL ==='/login' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/login"><FaSignInAlt className='mr-1'/>Login <hr/></NavDropdown.Item> :  <NavDropdown.Item className={currentURL ==='/logout' ? 'menu-header-dropdown' : ''}  onClick={logout}><FaArrowCircleLeft className='mr-1'/>Logout <hr/></NavDropdown.Item>}
                                    <NavDropdown.Item className={currentURL ==='/topup' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/topup"><FaPlusCircle className='mr-1'/>Topup <hr/></NavDropdown.Item>
                                    <NavDropdown.Item className={currentURL ==='/transfer' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/transfer"><FaExchangeAlt className='mr-1'/>Transfer <hr/></NavDropdown.Item>
                                    <NavDropdown.Item className={currentURL ==='/withdraw' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/withdraw"><FaMoneyBillAlt className='mr-1'/>Withdraw <hr/></NavDropdown.Item>
                                    <NavDropdown.Item className={currentURL ==='/registerdownline' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/registerdownline"><FaMoneyBillAlt className='mr-1'/>Add Downline<hr/></NavDropdown.Item>
                                    <NavDropdown.Item className={currentURL ==='/historypoint' ? 'menu-header-dropdown mr-5' : 'box-menu-dropdown mr-5'} href="/historypoint"><FaCoins className='mr-1'/>Mutasi Poin<hr/></NavDropdown.Item>
                                    <NavDropdown.Item className={currentURL ==='/historyorder' ? 'menu-header-dropdown mr-5' : 'box-menu-dropdown mr-5'} href="/historyorder"><FaCartArrowDown className='mr-1'/>History Order<hr/></NavDropdown.Item>
                              </NavDropdown>
                        }
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav" className='navbar-menu-custom'>
                              {/* <Nav className="ml-auto">
                                    <Nav.Link href="#section-header" className='menu-home' onClick={() => setSelect('home')} ><span style={{color : select === 'home' ? 'red' : ''}}>Home</span></Nav.Link>
                                    <Nav.Link href="#section-about" className='menu-home' onClick={() => setSelect('about')}><span style={{color : select === 'about' ? 'red' : ''}}>About</span></Nav.Link>
                                    <Nav.Link href="#section-home-product" className='menu-home'onClick={() => setSelect('products')}><span style={{color : select === 'products' ? 'red' : ''}}>Products</span></Nav.Link>
                                    <Nav.Link href="#featured" className='menu-home' onClick={() => setSelect('testimoni')}><span style={{color : select === 'testimoni' ? 'red' : ''}}>Testimoni</span></Nav.Link>
                                    <Nav.Link href="#footer-section" className='menu-home' onClick={() => setSelect('contact')}><span style={{color : select === 'contact' ? 'red' : ''}}>Contact</span></Nav.Link>
                              </Nav> */}
                              {currentURL ==='/' ? <Nav className="ml-auto">
                                    <Nav.Link href="#section-header" className='menu-home' onClick={() => setSelect('home')} ><span style={{color : select === 'home' ? 'red' : ''}}>Home</span></Nav.Link>
                                    <Nav.Link href="#section-about" className='menu-home' onClick={() => setSelect('about')}><span style={{color : select === 'about' ? 'red' : ''}}>About</span></Nav.Link>
                                    <Nav.Link href="#section-home-product" className='menu-home'onClick={() => setSelect('products')}><span style={{color : select === 'products' ? 'red' : ''}}>Products</span></Nav.Link>
                                    <Nav.Link href="#featured" className='menu-home' onClick={() => setSelect('testimoni')}><span style={{color : select === 'testimoni' ? 'red' : ''}}>Testimoni</span></Nav.Link>
                                    <Nav.Link href="#footer-section" className='menu-home' onClick={() => setSelect('contact')}><span style={{color : select === 'contact' ? 'red' : ''}}>Contact</span></Nav.Link>
                              </Nav> : ''}
                              <Nav className="ml-auto">
                                   {width > 415 && 
                                           <NavDropdown title={<img src={iconUser} alt='img-header'/>} id="basic-nav-dropdown" className='navbar-menu-right'>
                                                <NavDropdown.Item className={currentURL ==='/profile' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/profile"><FaUserAlt className='mr-1'/>{USER === null ? 'Profile' : USER.name} <hr/></NavDropdown.Item>
                                                {USER === null ? <NavDropdown.Item className={currentURL ==='/login' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/login"><FaSignInAlt className='mr-1'/>Login <hr/></NavDropdown.Item> :  <NavDropdown.Item className={currentURL ==='/logout' ? 'menu-header-dropdown' : ''}  onClick={logout}><FaArrowCircleLeft className='mr-1'/>Logout <hr/></NavDropdown.Item>}
                                                <NavDropdown.Item className={currentURL ==='/topup' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/topup"><FaPlusCircle className='mr-1'/>Topup <hr/></NavDropdown.Item>
                                                <NavDropdown.Item className={currentURL ==='/transfer' ? 'menu-header-dropdown' : 'box-menu-dropdown'} href="/transfer"><FaExchangeAlt className='mr-1'/>Transfer <hr/></NavDropdown.Item>
                                                <NavDropdown.Item className={currentURL ==='/withdraw' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/withdraw"><FaMoneyBillAlt className='mr-1'/>Withdraw <hr/></NavDropdown.Item>
                                                <NavDropdown.Item className={currentURL ==='/registerdownline' ? 'menu-header-dropdown' : 'box-menu-dropdown'}  href="/registerdownline"><FaMoneyBillAlt className='mr-1'/>Add Downline<hr/></NavDropdown.Item>
                                                <NavDropdown.Item className={currentURL ==='/historypoint' ? 'menu-header-dropdown mr-5' : 'box-menu-dropdown mr-5'} href="/historypoint"><FaCoins className='mr-1'/>Mutasi Poin<hr/></NavDropdown.Item>
                                                <NavDropdown.Item className={currentURL ==='/historyorder' ? 'menu-header-dropdown mr-5' : 'box-menu-dropdown mr-5'} href="/historyorder"><FaCartArrowDown className='mr-1'/>History Order<hr/></NavDropdown.Item>
                                          </NavDropdown>
                                   }
                                    {/* <NavDropdown title={<img src={iconHistory} alt='img-header'/>} id="basic-nav-dropdown" className='navbar-menu-right mr-4'>
                                          
                                    </NavDropdown> */}
                                     {width > 415 &&   <Nav.Link href='/cart' className='navbar-menu-right mr-3'><img src={iconCart} alt='img-header'/><span className='badge badge-danger position-absolute'>{lengthCart}</span></Nav.Link>}
                              </Nav>
                        </Navbar.Collapse>
                  </Navbar>
            </Fragment>
            
      )
}

export default Header
