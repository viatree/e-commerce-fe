"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import auth from "@/utils/auth";
import settings from "@/utils/settings";
import InputCom from "@/components/Helpers/InputCom";
import LoaderStyleOne from "@/components/Helpers/Loaders/LoaderStyleOne";
import Selectbox from "@/components/Helpers/Selectbox";
import ServeLangItem from "@/components/Helpers/ServeLangItem";
import {
  useLazyGetStateListApiQuery,
  useLazyGetCityListApiQuery,
  useLazyGetCountryListApiQuery,
  useAddNewAddressMutation,
} from "@/redux/features/locations/apiSlice";
import {
  useLazyGetShippingDestinationsQuery,
  useLazyCekOngkirQuery,
} from "@/redux/features/shipping/apiSlice";
import ArrowDownIcoCheck from "@/components/Helpers/icons/ArrowDownIcoCheck";
import { useDispatch } from "react-redux";
const MapComponent = dynamic(() => import("@/components/MapComponent/Index"), {
  ssr: false,
});

const CheckoutAddressForm = ({ onAddressSaved, onCancel, setShippingFromApi }) => {
  // Get website settings for map configuration
  const webSettings = settings();
 const [ongkir, setOngkir] = useState(null); 
  // Form data state - same structure as AddressTab
  const [formData, setFormData] = useState({
    fName: "",
    email: "",
    phone: "",
    address: "",
    home: true,
    office: false,
    country: null,
    state: null,
    city: null,
  });

  // Dropdown states
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);
  const [cityId, setCityId] = useState(null);
const [allZipData, setAllZipData] = useState([]);

const [districtDropdown, setDistrictDropdown] = useState([]);
const [districtId, setDistrictId] = useState(null);
const dispatch = useDispatch();

const [zipDropdown, setZipDropdown] = useState([]);
const [selectedZip, setSelectedZip] = useState(null);
const [selectedDistrict, setSelectedDistrict] = useState(null);
const [shippingCost, setShippingCost] = useState(null);
const [shippingOptions, setShippingOptions] = useState([]);
const [selectedShipping, setSelectedShipping] = useState(null);
const [showShippingModal, setShowShippingModal] = useState(false);

const [getShippingDestinations] = useLazyGetShippingDestinationsQuery();
const [cekOngkir] = useLazyCekOngkirQuery();
  // UI states
  const [errors, setErrors] = useState(null);
  const [location, setLocation] = useState(null);

  // Initialization location hooks REDUX RTK QUERY
  const [getCountryListApi] = useLazyGetCountryListApiQuery();
  const [getStateListApi, { isLoading: isGetStateLoading }] =
    useLazyGetStateListApiQuery();
  const [getCityListApi, { isLoading: isGetCityLoading }] =
    useLazyGetCityListApiQuery();
  const [addNewAddressQuery, { isLoading: isAddNewAddressLoading }] =
    useAddNewAddressMutation();

  /**
   * Fetch country list on component mount
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const userToken = auth()?.access_token;
        const response = await getCountryListApi({ token: userToken });
        if (response.data) {
          setCountryDropdown(response.data.countries || []);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [getCountryListApi]);


  /**
   * Handles input field changes for form data
   * @param {string} field - The field name to update
   * @param {any} value - The new value for the field
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles checkbox changes for address type selection
   * Ensures only one checkbox is selected at a time
   * @param {string} field - The checkbox field ('home' or 'office')
   */
  const handleCheckboxChange = (field) => {
    if (field === "home") {
      setFormData((prev) => ({ ...prev, home: !prev.home, office: false }));
    } else if (field === "office") {
      setFormData((prev) => ({ ...prev, office: !prev.office, home: false }));
    }
  };

  /**
   * Resets all form data to initial state
   */
  const resetData = () => {
    setFormData({
      fName: "",
      email: "",
      phone: "",
      address: "",
      home: true,
      office: false,
      country: null,
      state: null,
      city: null,
    });
    setStateDropdown(null);
    setCityDropdown(null);
    setErrors(null);
    setLocation(null);
  };

  /**
   * Creates address data object for API requests
   * @returns {Object} Formatted address data object
   */
  const createAddressData = () => {
    return {
      name: formData.fName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      type: formData.home ? "home" : formData.office ? "office" : null,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      latitude:
        Number(webSettings?.map_status) === 1 && location
          ? location.lat
          : undefined,
      longitude:
        Number(webSettings?.map_status) === 1 && location
          ? location.lng
          : undefined,
    };
  };

  /**
   * Handles getState functionality
   * @param {Object} value - Selected country object with id
   */
  const getState = async (value) => {
    if (value) {
      if (value?.id) {
        setFormData((prev) => ({ ...prev, country: value.id }));
        const response = await getStateListApi({
          countryId: Number(value.id),
          token: auth()?.access_token,
        });
        if (response.isSuccess) {
          setCityDropdown(null);
          setStateDropdown(response?.data?.states);
        }
      } else {
        console.error(
          `Argument is not valid. Argument should be object with id Ex: "{ id: 1 }"`
        );
      }
    }
  };

  /**
   * Handles getCities functionality
   * @param {Object} value - Selected state object with id
   */
  const getcity = async (value) => {
    if (value) {
      if (value?.id) {
        setFormData((prev) => ({ ...prev, state: value.id }));
        const response = await getCityListApi({
          stateId: Number(value.id),
          token: auth()?.access_token,
        });
        if (response.isSuccess) {
          setCityDropdown(response?.data?.cities);
        }
      } else {
        console.error(
          `Argument is not valid. Argument should be object with id Ex: "{ id: 1 }"`
        );
      }
    }
  };

  /**
   * Handler for city selection
   * @param {Object} value - Selected city object with id
   */
const selectCity = async (value) => {
  if (!value?.id) return;

  setFormData(prev => ({
    ...prev,
    city: value.id,
    zip_code: null,
  }));

  try {
    const res = await getShippingDestinations(value.id).unwrap();
    setDistrictDropdown(res.data || []);
  } catch (err) {
    console.error("Gagal ambil kelurahan:", err);
  }
};


const selectDistrict = async (value) => {
  if (!value?.postal_code) return;

  setSelectedDistrict(value);

  setFormData(prev => ({
    ...prev,
    district: value.name,
    zip_code: value.postal_code,
  }));

  try {
    const res = await cekOngkir(value.postal_code).unwrap();

    // ✅ SIMPAN SEMUA OPSI ONGKIR
    setShippingOptions(res.data || []);

    // buka modal pilihan
    setShowShippingModal(true);

  } catch (err) {
    console.error("Gagal cek ongkir:", err);
  }
};


const selectZipCode = (value) => {
  if (!value?.postal_code) return;

  setSelectedZip(value.postal_code);

  setFormData(prev => ({
    ...prev,
    zip_code: value.postal_code,
    subdistrict: value.name
  }));
};


  /**
   * Add new address functionality
   * Uses the same pattern as AddressTab component
   */
  const saveAddressSuccessHandler = (data, statusCode) => {
    if (statusCode === 200 || statusCode === 201) {
      resetData();
      toast.success(
        data?.notification ? data?.notification : "Address added successfully",
        {
          autoClose: 1000,
        }
      );
      // Call the callback to refresh addresses in parent component
      if (onAddressSaved) {
        onAddressSaved();
      }
    }
  };

  const saveAddressErrorHandler = (error) => {
    error.data && setErrors(error.data.errors);
    if (error.status === 403) {
      toast.error(error.data.message, {
        autoClose: 1000,
      });
    }
  };

  const saveAddress = async () => {
    // requestSaveAddress function to save address
    const requestSaveAddress = async () => {
      const userData = createAddressData();
      const userToken = auth()?.access_token;
      await addNewAddressQuery({
        data: userData,
        token: userToken,
        success: saveAddressSuccessHandler,
        error: saveAddressErrorHandler,
      });
    };

    if (Number(webSettings?.map_status) === 1) {
      if (location) {
        await requestSaveAddress();
      } else {
        toast.error("Please select location");
      }
    } else {
      await requestSaveAddress();
    }
  };

  /**
   * Check if field has error
   * @param {string} fieldName - Field name to check
   * @returns {boolean} Whether field has error
   */
  const hasError = (fieldName) => {
    return !!(errors && Object.hasOwn(errors, fieldName));
  };

  /**
   * Get error message for field
   * @param {string} fieldName - Field name to get error for
   * @returns {string} Error message
   */
  const getErrorMessage = (fieldName) => {
    return errors && Object.hasOwn(errors, fieldName)
      ? errors[fieldName][0]
      : "";
  };
  

  return (
    <div data-aos="zoom-in" className="w-full">
      {/* Form Header */}
      <div className="flex justify-between items-center">
        <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
          {ServeLangItem()?.Add_New_Address}
        </h1>
        <span onClick={onCancel} className="text-qyellow cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {/* Form Content */}
      <div className="form-area">
        <form>
          {/* Name Field */}
          <div className="mb-6">
            <div className="w-full mb-5 sm:mb-0">
              <InputCom
                label={ServeLangItem()?.Name + "*"}
                placeholder="Name"
                inputClasses="w-full h-[50px]"
                value={formData.fName}
                inputHandler={(e) => handleInputChange("fName", e.target.value)}
                error={hasError("name")}
              />
            </div>
            {hasError("name") && (
              <span className="text-sm mt-1 text-qred">
                {getErrorMessage("name")}
              </span>
            )}
          </div>

          {/* Email and Phone Fields */}
          <div className="flex rtl:space-x-reverse space-x-5 items-center mb-6">
            <div className="sm:w-1/2 w-full">
              <InputCom
                label={ServeLangItem()?.Email + "*"}
                placeholder={ServeLangItem()?.Email}
                inputClasses="w-full h-[50px]"
                value={formData.email}
                inputHandler={(e) => handleInputChange("email", e.target.value)}
                error={hasError("email")}
              />
              {hasError("email") && (
                <span className="text-sm mt-1 text-qred">
                  {getErrorMessage("email")}
                </span>
              )}
            </div>
            <div className="sm:w-1/2 w-full">
              <InputCom
                label={ServeLangItem()?.Phone_Number + "*"}
                placeholder="012 3  *******"
                inputClasses="w-full h-[50px]"
                value={formData.phone}
                inputHandler={(e) => handleInputChange("phone", e.target.value)}
                error={hasError("phone")}
              />
              {hasError("phone") && (
                <span className="text-sm mt-1 text-qred">
                  {getErrorMessage("phone")}
                </span>
              )}
            </div>
          </div>

          {/* Country Selection */}
          <div className="mb-6">
            <h1 className="input-label capitalize block mb-2 text-qgray text-[13px] font-normal">
              {ServeLangItem()?.Country}*
            </h1>
            <div
              className={`w-full h-[50px] border flex justify-between items-center border-qgray-border mb-2 ${
                hasError("country") ? "border-qred" : "border-qgray-border"
              }`}
            >
              <Selectbox
                action={getState}
                className="w-full px-5"
                defaultValue={
                  countryDropdown &&
                  countryDropdown.length > 0 &&
                  (function () {
                    let item =
                      countryDropdown.length > 0 &&
                      countryDropdown.find(
                        (item) =>
                          parseInt(item.id) === parseInt(formData.country)
                      );
                    return item ? item.name : "Select";
                  })()
                }
                datas={countryDropdown && countryDropdown}
              >
                {({ item }) => (
                  <>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <span className="text-[13px] text-qblack">{item}</span>
                      </div>
                      <span>
                        <ArrowDownIcoCheck />
                      </span>
                    </div>
                  </>
                )}
              </Selectbox>
            </div>
            {hasError("country") && (
              <span className="text-sm mt-1 text-qred">
                {getErrorMessage("country")}
              </span>
            )}
          </div>

      <div className="flex space-x-5 mb-6">

  {/* PROVINSI */}
  <div className="w-1/2">
    <h1 className="input-label mb-2">
      {ServeLangItem()?.State}*
    </h1>
    <div className="w-full h-[50px] border flex items-center">
      <Selectbox
        action={getcity}
        className="w-full px-5"
        defaultValue="Select"
        datas={stateDropdown}
      >
        {({ item }) => (
          <div className="flex justify-between w-full">
            <span>{item}</span>
            <ArrowDownIcoCheck />
          </div>
        )}
      </Selectbox>
    </div>
  </div>

  {/* CITY */}
  <div className="w-1/2">
    <h1 className="input-label mb-2">
      {ServeLangItem()?.City}*
    </h1>
    <div className="w-full h-[50px] border flex items-center">
      <Selectbox
        action={selectCity}
        className="w-full px-5"
        defaultValue="Select"
        datas={cityDropdown}
      >
        {({ item }) => (
          <div className="flex justify-between w-full">
            <span>{item}</span>
            <ArrowDownIcoCheck />
          </div>
        )}
      </Selectbox>
    </div>
  </div>

</div>

<div className="flex space-x-5 mb-6">

  {/* KELURAHAN */}
  <div className="w-1/2">
    <h1 className="input-label mb-2">
      Kelurahan*
    </h1>
    <div className="w-full h-[50px] border flex items-center border-qgray-border">
      <Selectbox
        action={selectDistrict}
        className="w-full px-5"
        datas={districtDropdown}
      >
        {({ item }) => (
          <div className="flex justify-between w-full">
            <span>
              {selectedDistrict?.name ?? "Pilih Kelurahan"}
            </span>
            <ArrowDownIcoCheck />
          </div>
        )}
      </Selectbox>
    </div>
  </div>

  {/* KODE POS */}
  <div className="w-1/2">
    <h1 className="input-label mb-2">
      Kode Pos*
    </h1>
    <div className="w-full h-[50px] border flex items-center border-qgray-border bg-gray-50">
     <InputCom
  placeholder="-"
  value={formData.zip_code || ""}
  readOnly
  inputHandler={() => {}}
  inputClasses="w-full h-full bg-transparent"
/>

    </div>
    
  </div>
  

</div>

          {/* Map Component for Location Selection */}
          <div className="mb-6">
            <div>
              <MapComponent
                location={location}
                locationHandler={setLocation}
                mapKey={webSettings?.map_key}
                mapStatus={Number(webSettings?.map_status)}
                searchEnabled
                searchInputError={
                  hasError("address") ? getErrorMessage("address") : ""
                }
                searchInputHandler={(value) =>
                  handleInputChange("address", value)
                }
                searchInputValue={formData.address}
              />
            </div>
          </div>

          {/* ===== OPSI PENGIRIMAN ===== */}
<div className="mt-4">
  <button
    type="button"
    onClick={() => setShowShippingModal(true)}
    className="w-full flex justify-between items-center p-3 border rounded-lg text-sm"
  >
    <span className="font-medium">
      Opsi Pengiriman
    </span>
    <span className="text-primary">
      Lihat semua &gt;
    </span>
  </button>

  {!selectedShipping && (
    <p className="text-xs text-red-500 mt-1">
      Silakan pilih metode pengiriman
    </p>
  )}
  {selectedShipping && (
  <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-sm">
    <p className="font-medium">
      {selectedShipping.name} ({selectedShipping.service})
    </p>
    <p className="text-gray-500">
      Estimasi {selectedShipping.etd || "-"} hari
    </p>
    <p className="font-semibold mt-1">
      Rp{selectedShipping.cost.toLocaleString("id-ID")}
    </p>
  </div>
)}

</div>

<br></br>
          {/* Address Type Selection */}
          <div className="flex rtl:space-x-reverse space-x-5 items-center">
            <div className="flex rtl:space-x-reverse space-x-2 items-center mb-10">
              <div>
                <input
                  checked={formData.home}
                  onChange={() => handleCheckboxChange("home")}
                  type="checkbox"
                  name="home"
                  id="home"
                />
              </div>
              <label
                htmlFor="home"
                className="text-qblack text-[15px] select-none capitalize"
              >
                {ServeLangItem()?.home}
              </label>
            </div>
            <div className="flex rtl:space-x-reverse space-x-2 items-center mb-10">
              <div>
                <input
                  checked={formData.office}
                  onChange={() => handleCheckboxChange("office")}
                  type="checkbox"
                  name="office"
                  id="office"
                />
              </div>
              <label
                htmlFor="office"
                className="text-qblack text-[15px] select-none"
              >
                {ServeLangItem()?.Office}
              </label>
            </div>
            
          </div>

          {/* Submit Button */}
          <button
            onClick={saveAddress}
            type="button"
            className="w-full h-[50px] disabled:cursor-not-allowed"
            disabled={isAddNewAddressLoading || !selectedShipping}
          >
            <div className="yellow-btn rounded">
              <span className="text-sm text-qblack">
                {ServeLangItem()?.Save_Address}
              </span>
              {isAddNewAddressLoading && (
                <span className="w-5" style={{ transform: "scale(0.3)" }}>
                  <LoaderStyleOne />
                </span>
              )}
            </div>
          </button>
        </form>
      </div>
      {/* ================= SHIPPING MODAL ================= */}
{showShippingModal && (
  <div className="fixed inset-0 bg-black/40 z-[9999] flex items-end">
    <div className="bg-white w-full rounded-t-xl max-h-[70vh] overflow-y-auto p-4">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pilih Pengiriman</h2>
        <button
          onClick={() => setShowShippingModal(false)}
          className="text-xl"
        >
          ✕
        </button>
      </div>

      {shippingOptions.length === 0 && (
        <p className="text-center text-gray-500">
          Ongkir tidak tersedia
        </p>
      )}

      {shippingOptions.map((item, index) => (
        <label
          key={index}
          className="flex justify-between items-center py-3 border-b cursor-pointer"
        >
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="shipping"
              checked={
                selectedShipping?.code === item.code &&
                selectedShipping?.service === item.service
              }
            onChange={() => {
  setSelectedShipping(item);

  // 🔥 KIRIM KE CHECKOUT PAGE
  setShippingFromApi({
    name: item.name,
    code: item.code,
    service: item.service,
    cost: item.cost,
    etd: item.etd,
  });

  setFormData(prev => ({
    ...prev,
    shipping_code: item.code,
    shipping_service: item.service,
    shipping_cost: item.cost,
    etd: item.etd,
  }));

  setShowShippingModal(false);
}}

            />

            <div>
              <p className="font-medium">
                {item.name} ({item.service})
              </p>
              <p className="text-sm text-gray-500">
                {item.description} • {item.etd || "-"} hari
              </p>
            </div>
          </div>

          <div className="font-semibold">
            Rp{item.cost?.toLocaleString("id-ID")}
          </div>
        </label>
      ))}
    </div>
  </div>
)}
{/* ================= END SHIPPING MODAL ================= */}

    </div>
  );
};

export default CheckoutAddressForm;
