import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Financial from '../components/Financial'
import '../styles/FinancialsPage.css'

const FinancialsPage = () => {
  return (
    <div>
        <Navbar />
        <div className="banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Financials</h1>
            <p>Transparency and accountability in our financial operations</p>
          </div>
        </div>
      </div>
      <section className='financial-documents'>
        <h2 className="section-header">Financial Documents</h2>
        <p>Access our financial reports, budgets, and other important documents</p>
        <br />
        <Financial maxFiles={null} />
      </section>
      <Footer />
    </div>
  )
}

export default FinancialsPage