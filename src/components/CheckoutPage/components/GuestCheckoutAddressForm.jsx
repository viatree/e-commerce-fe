"use client";
import { useEffect, useState } from "react";
import ArrowDownIcoCheck from "@/components/Helpers/icons/ArrowDownIcoCheck";
import InputCom from "@/components/Helpers/InputCom";
import Selectbox from "@/components/Helpers/Selectbox";
import ServeLangItem from "@/components/Helpers/ServeLangItem";
import MapComponent from "@/components/MapComponent/Index";
import {
  useLazyGetStateListApiQuery,
  useLazyGetCityListApiQuery,
  useLazyGetCountryListGuestApiQuery,
} from "@/redux/features/locations/apiSlice";
import auth from "@/utils/auth";
import settings from "@/utils/settings";
import {
  useLazyGetShippingDestinationsQuery,
  useLazyCekOngkirQuery,
} from "@/redux/features/shipping/apiSlice";
import { useDispatch } from "react-redux";
function GuestCheckoutAddressForm({
  fName,
  setFName,
  lName,
  setLName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  home,
  setHome,
  office,
  setOffice,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  guestLocation,
  setGuestLocation,
  errors,
   setShippingFromApi
  // this method works for shipping rule
}) {
  const webSettings = settings();

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
const [selectedDistrict, setSelectedDistrict] = useState(null);
const [shippingCost, setShippingCost] = useState(null);
const [shippingOptions, setShippingOptions] = useState([]);
const [selectedShipping, setSelectedShipping] = useState(null);
const [showShippingModal, setShowShippingModal] = useState(false);

  // Initialization location hooks REDUX RTK QUERY
  const [getCountryListGuestApi] = useLazyGetCountryListGuestApiQuery();
  const [getStateListApi, { isLoading: isGetStateLoading }] =
    useLazyGetStateListApiQuery();
  const [getCityListApi, { isLoading: isGetCityLoading }] =
    useLazyGetCityListApiQuery();

    const [destinationDropdown, setDestinationDropdown] = useState([]);
const [selectedZip, setSelectedZip] = useState(null);
const [getShippingDestinations] =
  useLazyGetShippingDestinationsQuery();
const [cekOngkir] = useLazyCekOngkirQuery();

  /**
   * Fetch country list on component mount
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountryListGuestApi();
        if (response.data) {
          setCountryDropdown(response.data.countries || []);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [getCountryListGuestApi]);

  /**
   * Handles getState functionality
   * @param {Object} value - Selected country object with id
   */
  const getState = async (value) => {
    if (value) {
      if (value?.id) {
        setCountry(value.id);
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
        setState(value.id);
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

  setCity(value.id); // update city state
  setSelectedDistrict(null);
  setDestinationDropdown([]);

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
  setAddress(prev => ({
    ...prev,
    district: value.name,
    zip_code: value.postal_code,
  }));

  try {
    const res = await cekOngkir(value.postal_code).unwrap();
    setShippingOptions(res.data || []);
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

  return (
    <div className="w-full">
      <div className="form-area">
        <div className="mb-6">
          <div className="sm:flex sm:space-x-5 items-center">
            <div className="sm:w-1/2 w-full  mb-5 sm:mb-0">
              <InputCom
                label={ServeLangItem()?.First_Name + "*"}
                placeholder={ServeLangItem()?.Name}
                inputClasses="w-full h-[50px]"
                value={fName}
                inputHandler={(e) => setFName(e.target.value)}
                error={!!(errors && Object.hasOwn(errors, "fName"))}
              />
              {errors && Object.hasOwn(errors, "fName") ? (
                <span className="text-sm mt-1 text-qred">
                  {errors.fName[0]}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="sm:w-1/2 w-full">
              <InputCom
                label={ServeLangItem()?.Last_Name + "*"}
                placeholder={ServeLangItem()?.Name}
                inputClasses="w-full h-[50px]"
                value={lName}
                inputHandler={(e) => setLName(e.target.value)}
                error={!!(errors && Object.hasOwn(errors, "lName"))}
              />
              {errors && Object.hasOwn(errors, "lName") ? (
                <span className="text-sm mt-1 text-qred">
                  {errors.lName[0]}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-5 items-center mb-6">
          <div className="sm:w-1/2 w-full">
            <InputCom
              label={ServeLangItem()?.Email_Address + "*"}
              placeholder={ServeLangItem()?.Email}
              inputClasses="w-full h-[50px]"
              value={email}
              inputHandler={(e) => setEmail(e.target.value)}
              error={!!(errors && Object.hasOwn(errors, "email"))}
            />
            {errors && Object.hasOwn(errors, "email") ? (
              <span className="text-sm mt-1 text-qred">{errors.email[0]}</span>
            ) : (
              ""
            )}
          </div>
          <div className="sm:w-1/2 w-full">
            <InputCom
              label={ServeLangItem()?.Phone_Number + "*"}
              placeholder="012 3  *******"
              inputClasses="w-full h-[50px]"
              value={phone}
              inputHandler={(e) => setPhone(e.target.value)}
              error={!!(errors && Object.hasOwn(errors, "phone"))}
            />
            {errors && Object.hasOwn(errors, "phone") ? (
              <span className="text-sm mt-1 text-qred">{errors.phone[0]}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mb-6">
          <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
            {ServeLangItem()?.Country}*
          </h1>
          <div
            className={`w-full h-[50px] border flex justify-between items-center mb-2 ${
              !!(errors && Object.hasOwn(errors, "country"))
                ? "border-qred"
                : "border-[#EDEDED]"
            }`}
          >
            <Selectbox
              action={getState}
              className="w-full px-5"
              defaultValue="Select"
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
          {errors && Object.hasOwn(errors, "country") ? (
            <span className="text-sm mt-1 text-qred">{errors.country[0]}</span>
          ) : (
            ""
          )}
        </div>
        <div className="flex space-x-5 items-center mb-6">
          <div className="w-1/2">
            <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
              {ServeLangItem()?.State}*
            </h1>
            <div
              className={`w-full h-[50px] border flex justify-between items-center mb-2 ${
                !!(errors && Object.hasOwn(errors, "state"))
                  ? "border-qred"
                  : "border-[#EDEDED]"
              }`}
            >
              <Selectbox
                action={getcity}
                className="w-full px-5"
                defaultValue="Select"
                datas={stateDropdown && stateDropdown}
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
            {errors && Object.hasOwn(errors, "state") ? (
              <span className="text-sm mt-1 text-qred">{errors.state[0]}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-1/2">
            <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
              {ServeLangItem()?.City}*
            </h1>
            <div
              className={`w-full h-[50px] border flex justify-between items-center mb-2 ${
                !!(errors && Object.hasOwn(errors, "city"))
                  ? "border-qred"
                  : "border-[#EDEDED]"
              }`}
            >
              <Selectbox
                action={selectCity}
                className="w-full px-5"
                defaultValue="select"
                datas={cityDropdown && cityDropdown}
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
            {errors && Object.hasOwn(errors, "city") ? (
              <span className="text-sm mt-1 text-qred">{errors.city[0]}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        {districtDropdown.length > 0 && (
  <div className="flex space-x-5 mb-6">

    {/* KELURAHAN */}
    <div className="w-1/2">
      <h1 className="input-label mb-2">Kelurahan*</h1>
      <div className="w-full h-[50px] border flex items-center border-qgray-border">
        <Selectbox
          action={selectDistrict}
          className="w-full px-5"
          datas={districtDropdown}
        >
          {({ item }) => (
            <div className="flex justify-between w-full">
              <span>{item.name}</span>
              <ArrowDownIcoCheck />
            </div>
          )}
        </Selectbox>
      </div>
    </div>

    {/* KODE POS */}
    <div className="w-1/2">
      <h1 className="input-label mb-2">Kode Pos*</h1>
      <div className="w-full h-[50px] border flex items-center border-qgray-border bg-gray-50">
        <InputCom
          placeholder="-"
          value={selectedDistrict?.postal_code || ""}
          readOnly
          inputHandler={() => {}}
          inputClasses="w-full h-full bg-transparent"
        />
      </div>
    </div>

  </div>
)}



        <div className=" mb-6">
          <div>
            <MapComponent
              location={guestLocation}
              locationHandler={setGuestLocation}
              mapKey={webSettings?.map_key}
              mapStatus={Number(webSettings?.map_status)}
              searchEnabled={Number(webSettings?.map_status) ? true : false}
              searchInputError={
                errors && Object.hasOwn(errors, "address") && errors.address[0]
              }
              searchInputHandler={setAddress}
              searchInputValue={address}
            />
          </div>
        </div>
        <div className="flex space-x-5 items-center ">
          <div className="flex space-x-2 items-center mb-10">
            <div>
              <input
                checked={home}
                onChange={() => {
                  setHome(!home);
                  setOffice(false);
                }}
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
          <div className="flex space-x-2 items-center mb-10">
            <div>
              <input
                checked={office}
                onChange={() => {
                  setOffice(!office);
                  setHome(false);
                }}
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

  // 🔥 update parent
  setShippingFromApi({
    name: item.name,
    code: item.code,
    service: item.service,
    cost: item.cost,
    etd: item.etd,
  });

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
}

export default GuestCheckoutAddressForm;
