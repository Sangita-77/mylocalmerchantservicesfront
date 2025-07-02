import { CiCircleInfo } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import AreaChartComponent from "./AreaChartComponent";

const ChartBox = ({
  id,
  chartTitle,
  totalValue,
  primaryColor,
  secondaryColor,
  strokeColor,
}) => {
  const areaChartProps = {
    id,
    primaryColor,
    secondaryColor,
    strokeColor,
  };

  return (
    <div className="userStatsSection">
      <div className="userStatsTop">
        <div className="userStatsTitle">{chartTitle}</div>
        <div className="userStatsValue">{totalValue}</div>
      </div>

      <div className="userStatsContainer">
        <div className="userGraphTop">
          <div className="userGraphLeft">
            <div className="userGraphLeftTitle">Analytics</div>
            <CiCircleInfo size={24} color="white" />
          </div>
          <div className="userGraphRight">
            <div>Select Time Range:</div>
            <div className="dropdownContainer">
              <select className="dropdown">
                <option value="" className="dropdownOption">
                  Monthly
                </option>
                <option value="" className="dropdownOption">
                  Monthly
                </option>
                <option value="" className="dropdownOption">
                  Monthly
                </option>
              </select>

              <CiCalendar size={20} color="white" />
            </div>
          </div>
        </div>

        <div className="graphContainer">
          <AreaChartComponent {...areaChartProps} />
        </div>
      </div>
    </div>
  );
};

export default ChartBox;
