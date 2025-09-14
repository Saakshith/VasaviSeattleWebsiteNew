import React from 'react'

import "../styles/HomePage.css"

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationCard from '../components/DonationCard'
import DriveGallery from '../components/DriveGallery'
import BoardMemberCard from '../components/BoardMemberCard'
import Testimonials from '../components/Testimonials'
import Financial from "../components/Financial"

import PlaceholderImage from "../images/placeholder_image.png"
import Dharmam from "../images/dharmam.avif"
import Seelam from "../images/seelam.avif"
import Ahimsa from "../images/ahimsa.avif"
import VasaviMata from "../images/vasavimata.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


const HomePage = () => {
  return (
    <div>
        <Navbar />
        <div className="hero-section">
            <h2 className="hero-subheading">Vasavi Seattle</h2>
            <h1 className="hero-heading">Serving The Community</h1>
            <p className="hero-description">We are a nonprofit community organization dedicated to preserving and promoting the spiritual, cultural, and social values of Vasavi Mata. Through cultural events, religious celebrations, and service initiatives, we strive to build a strong, connected, and compassionate community in the Pacific Northwest.</p>
            <DonationCard />
        </div>
        <section className="sponsors-section">
            <h2 className="section-header" id="sponsors-section-header">Backed By Our Sponsors</h2>
            <DriveGallery />
        </section>
        <section className="aboutus-section" id="about">
            <h2 className="section-header">About Us</h2>
            <div className="ourstory-subsection">
                <h3 className="subsection-header">Our Story</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                <div className="our-story-images">
                    <img src={PlaceholderImage} alt="" />
                    <img src={PlaceholderImage} alt="" />
                    <img src={PlaceholderImage} alt="" />
                    <img src={PlaceholderImage} alt="" />
                    <img src={PlaceholderImage} alt="" />
                    <img src={PlaceholderImage} alt="" />
                </div>
            </div>
            <div className="vasavimata-subsection">
                <h3 className="subsection-header">Who Is Vasavi Mata?</h3>
                <div className="vasavimata-subsection-content">
                    <p>Vasavi Mata, also known as Sri Vasavi Kanyaka Parameshwari, is a highly respected spiritual and historical figure within the Arya Vysya community and beyond. She is remembered for her commitment to the principles of non-violence, compassion, and social harmony, which continue to serve as guiding values for millions of people today. According to tradition, she was born in Penugonda, Andhra Pradesh, to King Kusuma Shresti and Queen Kusumamba, rulers of a prosperous trading community. Her life took a turning point when a powerful king attempted to marry her against her wishes. Rather than submit to coercion or allow her people to suffer the consequences of war, Vasavi chose a path of sacrifice, entering fire along with her community leaders to protect their honor and preserve peace. Over generations, this act came to symbolize extraordinary courage, moral integrity, and the triumph of values over force. Temples dedicated to Vasavi Mata can be found throughout South India and in communities across the world, where her story is retold as both history and inspiration. She is often regarded as an incarnation of Goddess Parvati, yet she is also honored as a leader who transformed her community through ethical strength and unity. Her legacy emphasizes ahimsa (non-violence), dharma (righteousness), and equality, making her teachings relevant not just in religious settings but also in modern discussions of social justice and ethical leadership. Today, followers celebrate her through festivals, cultural traditions, and acts of service, carrying forward her message of peace and dignity. By representing both divine energy and human resilience, Vasavi Mata continues to be a symbol of strength, compassion, and wisdom for generations to come.</p>
                    <img src={VasaviMata} alt="" />
                </div>
            </div>
            <div className="values-subsection">
                <div className="values-grid">
                    <div className="value-item">
                        <div className="value-image">
                            <img src={Dharmam} alt="Dharmam" />
                            <div className="value-overlay">
                                <h3>"Dharmam"</h3>
                            </div>
                        </div>
                    </div>
                    <div className="value-item">
                        <div className="value-image">
                            <img src={Seelam} alt="Seelam" />
                            <div className="value-overlay">
                                <h3>"Seelam"</h3>
                            </div>
                        </div>
                    </div>
                    <div className="value-item">
                        <div className="value-image">
                            <img src={Ahimsa} alt="Ahimsa" />
                            <div className="value-overlay">
                                <h3>"Ahimsa"</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mission-subsection">
                <h3 className="subsection-header">Our Mission</h3>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div className="boardmembers-subsection">
                <h3 className="subsection-header">Board Members</h3>
                <BoardMemberCard folderUrlOrId={process.env.REACT_APP_BOARD_MEMBERS_FOLDER_URL} />
            </div>
        </section>
        <section className="eventscta">
            <h2>Attend One of Our Events</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
            <Link to="/events"><button>View Upcoming Events <FontAwesomeIcon icon={faArrowRight}/></button></Link>
        </section>
        <section className='vasavistatistics'>
            <div className="vasavistatistic">
                <h2>10+</h2>
                <p>Board Members</p>
            </div>
            <div className="vasavistatistic">
                <h2>300+</h2>
                <p>Members</p>
            </div>
            <div className="vasavistatistic">
                <h2>90+</h2>
                <p>Volunteers</p>
            </div>
            <div className="vasavistatistic">
                <h2>100+</h2>
                <p>Youth Volunteers</p>
            </div>
            <div className="vasavistatistic">
                <h2>50+</h2>
                <p>Events Conducted</p>
            </div>
        </section>
        <section className="testimonials">
            <Testimonials />
        </section>
        <section className="financials-section">
            <h2 className="section-header">Vasavi Seattle takes great pride in our financial efficiency and accountability. We work to maximize the value of every dollar we receive.</h2>
            <p>More than 90 percent of our expended resources – among the highest of all philanthropic organizations – support our poverty-fighting projects around the world. Less than 10 percent of expended resources go toward administrative and fundraising costs.
            We encourage you to investigate before you donate. Click on the links below for independently verified information about Vasavi Seattle's finances.</p>
            <div className="financials-preview-content">
                <Financial folderUrlOrId={process.env.REACT_APP_FINANCIALS_FOLDER_URL} maxFiles={3} />
            </div>
        </section>
        <Footer />
    </div>
  )
}

export default HomePage