import { useState ,useContext, useEffect} from 'react'; // Import useState if not already imported
import { left_arrow, down_arrow, logo_with_name,line_one } from "../../../assets/icons";
import { HRCompanyContext } from '../../../components/api/HRCompanyDataContext';
import {Link} from 'react-router-dom';
import axios from 'axios';



const CompanyInfo = () => {
  const [image, setImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const {HRCompanyData}=useContext(HRCompanyContext);
  const [updateHRCompanyData, setUpdateHRCompanyData] = useState({
    companyName: '',
    companyLogo: '',
    companyEmail: '',
    companyHeadquarters: {
      country: '',
      state: '',
      city: '',
    },
    companySize: '',
    defaultCurrency: '',
    industry: 'Technology',
  });

  // console.log(HRCompanyData,'from cash')
  const initializeUpdateHRCompanyData = () => {
    if (HRCompanyData && HRCompanyData.companyDetails) {
      setUpdateHRCompanyData((prevData) => ({
        ...prevData,
        companyName: HRCompanyData.companyDetails.companyName || '',
        companyLogo: HRCompanyData.companyDetails.companyLogo || '',
        companyEmail: HRCompanyData.companyDetails.companyEmail || '',
        companyHeadquarters: {
          country: HRCompanyData.companyDetails.companyHeadquarters.country || '',
          state: HRCompanyData.companyDetails.companyHeadquarters.state || '',
          city: HRCompanyData.companyDetails.companyHeadquarters.city || '',
        },
        companySize: HRCompanyData.companyDetails.companySize || '',
        defaultCurrency: HRCompanyData.companyDetails.defaultCurrency || '',
        industry: HRCompanyData.companyDetails.industry || 'Technology',
      }));
    }
  };

  useEffect(()=>{
    initializeUpdateHRCompanyData();

  },[HRCompanyData])

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name == 'city' || name=='state' || name=='country'){

      let updatedCompanyData = JSON.stringify(updateHRCompanyData)
      let updatedCompanyDataObject = JSON.parse(updatedCompanyData)
      updatedCompanyDataObject.companyHeadquarters[name]=value
      
      console.log(updatedCompanyDataObject, 'update...')

      setUpdateHRCompanyData(
        updatedCompanyDataObject
      );
    }

    else{
    setUpdateHRCompanyData({
      ...updateHRCompanyData,
      [name]: value,
    });
  }
  };

  const handleUpdateHRCompanyInfoSubmit=async(e)=>{
    e.preventDefault();
    console.log(HRCompanyData)
    try{
      const hrCompanyResponse= await axios.put('http://localhost:3000/api/hrcompany/603f3b07965db634c8769a081',{
        companyDetails:updateHRCompanyData
      })
      console.log("hrCompanyData Updated", hrCompanyResponse.data)

    }catch(error){
      console.error('Error while updating the Company Info');
    }

  }

  
  const handleCompanyLogoUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const removeImage = () => {
    setImage(null);
  };


 


  const industryOptions=['Technology', 'TextTiles','Finance','Cosmetics','Chemical','Others']
  const defaultCurrencies = ['INR', 'AD', 'USD', 'EUR', 'GBP'];

  const inputClassName="relative w-full h-[48px] outline-none px-2"

  return (
    <form onSubmit={handleUpdateHRCompanyInfoSubmit}>
    <div className="relative bg-white w-full h-[1654px] overflow-hidden text-left text-[24px] text-darkslategray-100 font-cabin">
      <img
        className="absolute top-[43px] left-[calc(50%_-_536px)] w-[202px] h-[49px] overflow-hidden"
        alt="logo_with_name"
        src={logo_with_name}
      />
      <div className="absolute top-[118px] left-[95px] rounded-xl bg-white w-[1072px] h-[989px] overflow-hidden">
        <div className="absolute top-[40px] left-[40px] flex flex-row items-center justify-start gap-[16px]">
          <Link to="/">
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt="left_arrow"
            src={left_arrow}
          />
          </Link>
          <div className="flex flex-col items-start justify-start">
            <div className="relative tracking-[-0.04em] font-semibold">
              Configure Company Information
            </div>
          </div>
        </div>
        <div className="absolute top-[283px] left-[49px] w-[956px] h-[1015px] flex flex-col items-start justify-start gap-[32px] text-sm text-dimgray">
          <div className="flex flex-col items-start justify-start">
            <div className="w-[832px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Company Name</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-ebgrey-500">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid  border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <input
                      type="text"
                      className={inputClassName}
                      id="companyName"
                      name="companyName"
                      placeholder="Enter Company Name"
                      value={updateHRCompanyData.companyName}
                      onChange={handleChange}
                     
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="w-[832px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Company Email Address</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-ebgrey-500">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <input
                      type="text"
                      className="relative w-full h-[48px] outline-none px-2"
                      placeholder="Enter Email Address"
                      id="companyEmail"
                      name="companyEmail"
                      value={updateHRCompanyData.companyEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[838px] flex flex-col items-start justify-start">
        <div className="flex flex-row items-start justify-start gap-[32px]">
          <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Company Size</div>
            <div className="w-[403px] h-[49px] flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-500">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[2px] border-solid border-ebgrey-200">
                <input
                  type="text"
                  className="flex-1 outline-none px-2 h-[48px]"
                  placeholder="Enter Company Size"
                  id="companySize"
                  name="companySize"
                  value={updateHRCompanyData.companySize}
                  onChange={handleChange}
                  />
               
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <img
                      src={down_arrow}
                      alt="Dropdown Arrow"
                      className="cursor-pointer"
                    />
                  </div>
              </div>
            </div>
          </div>
          <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
            <div className="relative">Industry</div>
            <div className="w-[403px] h-[49px] flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-500">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[2px] border-solid border-ebgrey-200">
                  <select 
                  id="industry"
                  name="industry"
                  value={updateHRCompanyData.industry}
                  onChange={handleChange}
                  className="flex-1 outline-none px-2 h-[48px] appearance-none"
                  
                  >

                    {industryOptions.map((item , index)=>(<option className='text-[12px]  w-[393px] h-10 py-[14px] pl-[16px] pr-[357px]' key={index}>{item}</option>))}
                  </select>
                 


                
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 cursor-pointer pointer-events-none">
                    <img
                      src={down_arrow}
                      alt="Dropdown Arrow"
                      className=""
                    />
                  </div>
              </div>
       
     
            </div>
          </div>
         
        </div>
      </div>
      <div className="w-[832px] h-[390px] flex flex-col items-start justify-start pt-[15px] px-0 pb-0 box-border gap-[12px]">
      <img className="relative w-[992px] bg-gray-500 h-px" alt="" src={line_one} />
        <div className="relative font-medium text-darkslategray-200">
          Company HQ Location
        </div>
        <div className="w-[835px] h-[86px] flex flex-row items-start justify-start">
          <div className="w-[835px] flex flex-row items-start justify-start gap-[85px]">
            <div className="w-[226px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">City</div>
              <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
              <div className=" relative flex-1 rounded-md bg-white box-border w-[217px] h-16 flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid border-ebgrey-200">
                <input
                  type="text"
                  className="flex-1 outline-none px-2 h-[48px] font-normal not-italic"
                  placeholder="Enter City"
                  id="city"
                  name="city"
                  value={updateHRCompanyData.companyHeadquarters.city}
                  onChange={handleChange}
                />
                
              </div>
            </div>
            </div>
            <div className="w-[226px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">State</div>
              <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
              <div className="relative flex-1 rounded-md bg-white box-border w-[217px] h-16 flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid border-ebgrey-200">
                <input
                  type="text"
                  className="flex-1 outline-none px-2 h-[48px]"
                  placeholder="Enter State"
                  value={updateHRCompanyData.companyHeadquarters.state}
              
                  onChange={handleChange}
                  id="state"
                  name="state"/>
                {/* <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <img
                      src={down_arrow}
                      alt="Dropdown Arrow"
                      className="cursor-pointer"
                    />
                  </div> */}
              </div>
            </div>
            </div>
            <div className="w-[226px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Country</div>
              <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
              <div className="relative flex-1 rounded-md bg-white box-border w-[217px] h-16 flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid border-ebgrey-200">
                <input
                id="country"
                name="country"
                  type="text"
                  className="flex-1 outline-none px-2 "
                  placeholder="Enter Country"
                  value={updateHRCompanyData.companyHeadquarters.country}
                  onChange={handleChange}
                />
                {/* <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <img
                      src={down_arrow}
                      alt="Dropdown Arrow"
                      className="cursor-pointer"
                    />
                  </div> */}
              </div>
            </div>
            </div>
           
              
          
          </div>
        </div>
        <img className="relative w-[992px] bg-gray-500 h-px" alt="" src={line_one} />
      
          <div className="w-[408px] h-[74px] flex flex-col items-start justify-start gap-[8px]">
        <div className="relative font-medium">Default Currency</div>
        <div className="w-[408px] h-[49px] flex flex-row flex-wrap items-start justify-start text-ebgrey-400">
          <div className="w-[403px] h-12 flex flex-row flex-wrap items-start justify-start">
            <div className="self-stretch flex-1 relative rounded-md bg-white box-border w-[403px] h-16 flex flex-row items-center justify-between py-2 px-6 border-[2px] border-solid border-ebgrey-200">
             
               <select
               id="defaultCurrency"
               name="defaultCurrency"
               value={updateHRCompanyData.defaultCurrency}
               onChange={handleChange}
                className="flex-1 outline-none px-2 appearance-none">
                    {defaultCurrencies.map((item)=>(
                      
                    <option key={item}>{item}</option>))}
                  </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                <img
                  src={down_arrow}
                  alt="Dropdown Arrow"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      </div>
       
        </div>
        <input type='text'
        id="companyLogo"
        name="companyLogo"
        value={updateHRCompanyData.companyLogo}
        onChange={handleChange}/>
        
        {/* <div  className="absolute cursor-pointer rounded-full top-[94px] left-[468px] w-[153px] h-[152px] flex flex-row items-center justify-start bg-black">
          <img
            className="relative rounded-[100px] w-[151px] h-[157px] overflow-hidden shrink-0 object-cover"
            alt=""
            src=""
          />
        </div> */}
        {/* image upload */}
       
           
     <div className="justify-center flex items-center h-[240px] border border-black ">
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <label
                    htmlFor="profile-pic-input"
                    className="block w-full h-full cursor-pointer"
                  >
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center hover:bg-opacity-75 hover:bg-black cursor-pointer"
                          onClick={removeImage}
                        >
                          {isHovered ? (
                            <div className="text-center font-semibold text-sm text-white">
                              Remove Background
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full border  bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                        Upload Image
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="profile-pic-input"
                    accept="image/*"
                    onChange={handleCompanyLogoUpload}
                    className="sr-only"
                  />
                </div>
              </div>
              
      </div>
      <button type="submit" className="cursor-pointer [border:none] py-4 px-8 bg-eb-primary-blue-500 absolute top-[1164px] left-[845px] rounded-[32px] h-12 flex flex-row items-center justify-center box-border">
        <div className="relative text-base font-medium font-cabin text-white text-center inline-block w-[70px] h-5 shrink-0">
          Continue
        </div>
      </button>
      
    
    </div>
    </form>
  );
};

export default CompanyInfo;

