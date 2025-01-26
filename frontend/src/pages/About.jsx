import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from "../components/NewsletterBox";

function About() {
    return (
        <div>
            <div className="pt-8 text-2xl text-center border-t">
                <Title text1={'ABOUT'} text2={'US'} />
            </div>

            <div className="flex gap-16 my-10 felx-col md:flex-row">
                <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-garay-600">
                    <p>Forever was founded in 2012 by a group of friends who were passionate about fashion. We believe in quality and craftsmanship, and we are dedicated to providing our customers with the best products available.</p>
                    <p>Our collection covers various styles, including trendy tops, stylish bottoms, and statement accessories. We also have a range of innerwear and loungewear that enhance your wardrobe.</p>
                    <b className="text-gray-800">Our Mission</b>
                    <p>Our mission is to provide a stylish and comfortable wardrobe for women and men. We believe in quality and craftsmanship, and we are dedicated to providing our customers with the best products available.</p>
                </div>
            </div>

            <div className="py-4 text-xl">
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>

            <div className="flex flex-col mb-20 text-sm md:flex-row">
                <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20">
                    <b>Quality Assurance:</b>
                    <p className="text-gray-600">We ensure that all our products meet our high standards of quality and craftsmanship.</p>
                </div>

                <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20">
                    <b>Convenience:</b>
                    <p className="text-gray-600">With our user-friendly website and easy checkout process, shopping with us is a breeze.</p>
                </div>

                <div className="flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20">
                    <b>Exceptional Customer Service:</b>
                    <p className="text-gray-">Our dedicated customer service team is always available to assist you with any questions or concerns.</p>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
}

export default About;
