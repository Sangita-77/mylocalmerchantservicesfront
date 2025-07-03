import { useRef } from "react";
import "./../styles/styles.css";
import bannerBg from "./../assets/images/onboarding_banner_bg.jpg";
import { GoArrowRight } from "react-icons/go";
import dollarPig from "./../assets/images/dollar_pig.png";
import Free from "./../assets/images/Free.png";
import rateStar from "./../assets/images/rate_star.png";
import support from "./../assets/images/support.png";
import blueShade from "./../assets/images/blue_shade.png";
import idCard from "./../assets/images/id_card.png";
import personLock from "./../assets/images/person_lock.png";
import dolarBag from "./../assets/images/dollar_bag.png";
import arrowDown from "./../assets/images/bg_arrow_down_03.png";
import arrowUp from "./../assets/images/bg_arrow_up_03.png";
import creditCardMachineAd from "./../assets/images/credit_card_machine_ad_02.png";
import bottomBlueShade from "./../assets/images/blue_shades_circle.png";
import yellowShade from "./../assets/images/yellow_shade.png";
import personSearch from "./../assets/images/person_search_03.png";
import smilingPerson from "./../assets/images/smiling_person_03.png";
import stripeLogo from "./../assets/images/stripe_logo_03.png";
import walmartLogo from "./../assets/images/walmart_logo_03.png";
import { FaCheckSquare } from "react-icons/fa";
import cart from "./../assets/images/cart_03.png";
import idCardSticker from "./../assets/images/id_card_sticker_03.png";
import safeCheckSticker from "./../assets/images/safe_check_sticker_03.png";
import ButtonLarge from "../components/ButtonLarge";
import { useNavigate } from "react-router-dom";
import { routes } from "../utils/routes";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const arrowVariants = {
  hidden: { width: 0 },
  show: {
    width: 240,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const OnboardingPage = () => {
  const arrowDownRef = useRef(null);
  const arrowUpRef = useRef(null);

  const navigate = useNavigate();

  // const arrowDownInView = useInView(arrowDownRef, { amount: 0.5 });
  // const arrowUpInView = useInView(arrowUpRef, { amount: 0.5 });

  return (
    <div className="onboardingPageMainContainer">
      <div className="onboardingBannerContainer">
        <div className="bannerBgContainer">
          <img src={bannerBg} alt="" className="onboardingBannerImage" />
        </div>
        <img
          src={cart}
          className="sticker"
          alt=""
          style={{
            top: "22%",
            left: "16%",
            width: 75,
            height: 75,
            objectFit: "contain",
          }}
        />
        <img
          src={idCardSticker}
          className="sticker"
          alt=""
          style={{
            top: "19%",
            right: "48%",
            width: 80,
            height: 80,
            objectFit: "contain",
          }}
        />
        <img
          src={safeCheckSticker}
          className="sticker"
          alt=""
          style={{
            top: "22%",
            right: "16%",
            width: 75,
            height: 75,
            objectFit: "contain",
          }}
        />

        <img src={blueShade} alt="" className="blueShadeUpward" />
        <img src={blueShade} alt="" className="blueShadeLeftWard" />

        <div className="onboardingPageBannerContentContainer">
          <p className="bannerTitleLarge">Find Local</p>
          <p className="bannerTitleMedium">Credit Card Processing Agents</p>
          <p className="bannerTitleSmall">
            Save time and money while improving service
          </p>
          <ButtonLarge
            title={"Find Local Agents"}
            icon={<GoArrowRight size={32} color="#000000" />}
            onClick={() => navigate(routes.merchant_list())}
          />
        </div>
      </div>

      <div className="onboardingBannerLeaflet">
        <div className="bannerLeafletItem">
          <img src={Free} alt="" className="leafletItemImg" />
          <p className="leafletItemTitle">100% Free</p>
          <p className="leafletItemSubTitle">So, search away</p>
        </div>

        <div className="bannerLeafletItem">
          <img src={rateStar} alt="" className="leafletItemImg" />
          <p className="leafletItemTitle">100% Free</p>
          <p className="leafletItemSubTitle">So, search away</p>
        </div>

        <div className="bannerLeafletItem">
          <img src={dollarPig} alt="" className="leafletItemImg" />
          <p className="leafletItemTitle">100% Free</p>
          <p className="leafletItemSubTitle">So, search away</p>
        </div>

        <div className="bannerLeafletItem">
          <img src={support} alt="" className="leafletItemImg" />
          <p className="leafletItemTitle">100% Free</p>
          <p className="leafletItemSubTitle">So, search away</p>
        </div>
      </div>

      <div className="findAgentsSection">
        <img src={yellowShade} alt="" className="topYellowShade" />
        <img src={bottomBlueShade} alt="" className="bottomBlueShade" />
        <img src={blueShade} alt="" className="topBlueShade" />
        <img src={yellowShade} alt="" className="bottomYellowShade" />

        <div className="findAgentsSectionTop">
          <p className="findAgentsSectionTitle">
            The smart way to shop for payment processing
          </p>
          <p className="findAgentsSectionSubtitle">
            We show you local agents. You choose who's best for your business.
          </p>
        </div>

        <div
          className="findAgentsSectionBottom"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
        >
          {/* Item 1 */}
          <div className="findAgentsSectionBottomItem" variants={itemVariants}>
            <img
              src={idCard}
              alt=""
              className="findAgentsSectionBottomItemImg"
            />
            <p className="findAgentsSectionBottomItemTitle">Register</p>
            <p className="findAgentsSectionBottomItemSubtitle">
              Create your business profile
            </p>
          </div>

          {/* Arrow Down */}
          <img
            src={arrowDown}
            alt="arrow-down"
            className="arrow"
            variants={arrowVariants}
            style={{
              display: "block",
              transformOrigin: "left",
              height: "auto",
            }}
          />

          {/* Item 2 */}
          <div
            className="findAgentsSectionBottomItem"
            id="findAgentsSectionBottomItemMiddle"
            variants={itemVariants}
          >
            <img
              src={personLock}
              alt=""
              className="findAgentsSectionBottomItemImg"
            />
            <p className="findAgentsSectionBottomItemTitle">
              Find Local Agents
            </p>
            <p className="findAgentsSectionBottomItemSubtitle">
              Our agent-finder tool makes it easy to find quality agents
            </p>
          </div>

          {/* Arrow Up */}
          <img
            src={arrowUp}
            alt="arrow-up"
            className="arrow"
            variants={arrowVariants}
            style={{
              display: "block",
              transformOrigin: "left",
              height: "auto",
            }}
          />

          {/* Item 3 */}
          <div className="findAgentsSectionBottomItem" variants={itemVariants}>
            <img
              src={dolarBag}
              alt=""
              className="findAgentsSectionBottomItemImg"
            />
            <p className="findAgentsSectionBottomItemTitle">Register</p>
            <p className="findAgentsSectionBottomItemSubtitle">
              Get better service and lower prices
            </p>
          </div>
        </div>

        <button className="findAgentButton">
          Find Agents Now
          <GoArrowRight size={32} />
        </button>
      </div>

      <div className="merchantRegisterSection">
        <div className="merchantRegisterSectionLeft">
          <img
            src={creditCardMachineAd}
            alt=""
            className="creditCardMachineAdImg"
          />
        </div>

        <div className="merchantRegisterSectionRight">
          <div>
            <p className="registerSectionTitle">Register your</p>
            <p className="registerSectionSubtitle">merchant services company</p>
          </div>

          <p className="registerSectionContent">
            Increase your leads <br /> 100% free! Both ISOs and <br />{" "}
            independent
          </p>

          <div className="registerPoints">
            <div className="registerPointsItem">
              <FaCheckSquare color={"#fdda66"} />
              <p className="registerPointsParticular">
                Register using the button below
              </p>
            </div>

            <div className="registerPointsItem">
              <FaCheckSquare color={"#fdda66"} />
              <p className="registerPointsParticular">
                Build your profile and select load prefrences
              </p>
            </div>

            <div className="registerPointsItem">
              <FaCheckSquare color={"#fdda66"} />
              <p className="registerPointsParticular">
                Local businesses see your listing
              </p>
            </div>

            <div className="registerPointsItem">
              <FaCheckSquare color={"#fdda66"} />
              <p className="registerPointsParticular">
                You get Real Local leads every month 100% free
              </p>
            </div>
          </div>
            <ButtonLarge
              title={"Register Your Merchant"}
              icon={<GoArrowRight size={32} />}
              onClick={() => navigate(routes.registration())}
            />
        </div>
      </div>

      <div className="agentSearchSection">
        <img src={yellowShade} alt="" className="agentTopYellowShade" />
        <img src={blueShade} alt="" className="agentBottomBlueShade" />
        <img src={blueShade} alt="" className="agentTopBlueShade" />
        <img src={yellowShade} alt="" className="agentBottomYellowShade" />

        <div className="agentSearchSectionLeftContainer">
          <div style={{ marginBottom: 40, width: "100%" }}>
            <p className="agentSearchSectionTitle">The Power</p>
            <p className="agentSearchSectionTitle2">of agent search</p>
          </div>

          <div>
            <div style={{ marginBottom: 20, marginTop: -12 }}>
              <p className="agentSearchSectionSubtitle">
                See what each agent offers.
              </p>
              <p className="agentSearchSectionSubtitle">
                Filter for what you need.
              </p>
            </div>

            <p className="findAgentsPointsTitle">Find agents based on</p>

            <div className="findAgentsPoints">
              <div className="findAgentsPointsItem">
                <FaCheckSquare color="#0052a4" size={18} />
                <p className="findAgentsParticulars">Location</p>
              </div>

              <div className="findAgentsPointsItem">
                <FaCheckSquare color="#0052a4" size={18} />
                <p className="findAgentsParticulars">Pricing model</p>
              </div>

              <div className="findAgentsPointsItem">
                <FaCheckSquare color="#0052a4" size={18} />
                <p className="findAgentsParticulars">Point of sale</p>
              </div>

              <div className="findAgentsPointsItem">
                <FaCheckSquare color="#0052a4" size={18} />
                <p className="findAgentsParticulars">Equipment offered</p>
              </div>

              <div className="findAgentsPointsItem">
                <FaCheckSquare color="#0052a4" size={18} />
                <p className="findAgentsParticulars">Additional services</p>
              </div>
            </div>
            <ButtonLarge
              title={"Register Your Merchant"}
              icon={<GoArrowRight size={32} color="#000000" />}
              onClick={() => navigate(routes.registration())}
            />
          </div>
        </div>

        <div className="agentSearchSectionRightContainer">
          <img src={personSearch} alt="" className="agentSearchSectionImg" />
        </div>
      </div>

      <div className="merchantRegisterLeaflet">
        <div>
          <p className="merchantRegisterLeafletTitle">
            Get Merchant services LEADS near you!
          </p>
          <p className="merchantRegisterLeafletTitle">
            Real, local, and 100% free!
          </p>
        </div>
          <ButtonLarge
            title={"Register Now"}
            icon={<GoArrowRight size={32} color="#000000" />}
            onClick={() => navigate(routes.registration())}
          />
      </div>

      <div className="articleSection">
        <p className="articleSectionTitle">
          Explore Our Latest Blog & Articles
        </p>

        <div className="articleSectionInner">
          <div className="articleItem">
            <div className="articleImgContainer">
              <img src={smilingPerson} alt="" className="articleImg" />
            </div>

            <div className="articleItemContent">
              <p className="articleTitle">
                What is a Group Purchasing Organization?
              </p>
              <p className="articleDesc">
                If you are a small business owner, keeping track of how things
                add up so quickly can be extra straining.
              </p>

              <button className="articleButton">
                Read more
                <GoArrowRight size={32} color="#22a1f1" />
              </button>
            </div>
          </div>

          <div className="articleItem">
            <div className="articleImgContainer">
              <img src={stripeLogo} alt="" className="articleImg" />
            </div>

            <div className="articleItemContent">
              <p className="articleTitle">
                What is a Group Purchasing Organization?
              </p>
              <p className="articleDesc">
                If you are a small business owner, keeping track of how things
                add up so quickly can be extra straining.
              </p>

              <button className="articleButton">
                Read more
                <GoArrowRight size={32} color="#22a1f1" />
              </button>
            </div>
          </div>

          <div className="articleItem">
            <div className="articleImgContainer">
              <img src={walmartLogo} alt="" className="articleImg" />
            </div>

            <div className="articleItemContent">
              <p className="articleTitle">
                What is a Group Purchasing Organization?
              </p>
              <p className="articleDesc">
                If you are a small business owner, keeping track of how things
                add up so quickly can be extra straining.
              </p>

              <button className="articleButton">
                Read more
                <GoArrowRight size={32} color="#22a1f1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
