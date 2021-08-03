/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import styled from "styled-components";
import { appsetting } from "../../../../../envirment/appsetting";
// import { KTCookie } from "../_metronic/_assets/js/components/cookie";
import { KTCookie } from "../../../../_assets/js/components/cookie";
// import { TokenContext } from "../../../../../app/BasePage";

const SubSVGStyles = styled(SVG)`
  width: 20px !important;
  height: 20px !important;
`;

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const { server_path } = appsetting;

  const empID = KTCookie.getCookie("empID");
  // const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  // const { token, empID } = useContext(TokenContext);

  const [menuValues, setMenuValues] = useState([]);
  const [token, setToken] = useState();
  // console.log(location);
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  // let test = [
  //   {
  //     module_ID: 426,
  //     navigateUrl: "/dashboard",
  //     module_Name: "Dashboard",
  //     sub_Parent_Module: "",
  //     parent_Module: "",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Dashboard.svg",
  //     m_Order_Top: 1,
  //   },
  //   {
  //     module_ID: 400,
  //     navigateUrl: "/requestable",
  //     module_Name: "Requestable Assets",
  //     sub_Parent_Module: null,
  //     parent_Module: null,
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Requestable.svg",
  //     m_Order_Top: 2,
  //   },
  //   {
  //     module_ID: 401,
  //     navigateUrl: "/requested-list",
  //     module_Name: "Requested List",
  //     sub_Parent_Module: null,
  //     parent_Module: null,
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Requested-List.svg",
  //     m_Order_Top: 3,
  //   },
  //   {
  //     module_ID: 411,
  //     navigateUrl: "/Configurations/Bar_QR",
  //     module_Name: "Bar Code & QR Code",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Barcode-product.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 412,
  //     navigateUrl: "/Configurations/Labels",
  //     module_Name: "Labels",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 2,
  //     menu_Icons: "/media/svg/icons/General/Labels.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 413,
  //     navigateUrl: "/Configurations/Notifications",

  //     module_Name: "Notifications and Alerts",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 3,
  //     menu_Icons: "/media/svg/icons/General/Notification.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 429,
  //     navigateUrl: "/Configurations",
  //     module_Name: "Configurations",
  //     sub_Parent_Module: "1",
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 4,
  //     module_Order: 4,
  //     menu_Icons: "/media/svg/icons/General/Configurations.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 422,
  //     navigateUrl: "/Settings",
  //     module_Name: "Settings",
  //     sub_Parent_Module: "1",
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Settings.svg",
  //     m_Order_Top: 8,
  //   },
  //   {
  //     module_ID: 405,
  //     navigateUrl: "/Settings/Type",
  //     module_Name: "Type",
  //     sub_Parent_Module: null,
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 2,
  //     menu_Icons: "/media/svg/icons/General/Type.svg",
  //     m_Order_Top: 8,
  //   },
  //   {
  //     module_ID: 406,
  //     navigateUrl: "/Settings/Category",
  //     module_Name: "Category",
  //     sub_Parent_Module: null,
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 3,
  //     menu_Icons: "/media/svg/icons/General/Category.svg",
  //     m_Order_Top: 8,
  //   },
  // ];
  useEffect(() => {
    fetch(`${server_path}api/Token?id=${empID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => setToken(data));
  }, [empID, server_path]);

  useEffect(() => {
    fetch(`${server_path}api/MenuApi?empID=${empID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) =>
          a.m_Order > b.m_Order_Top ? 1 : b.m_Order_Top > a.m_Order_Top ? -1 : 0
        );

        // console.log(data);

        // data.push(obj);
        setMenuValues(data);
      });
  }, [server_path, token, empID]);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Dashboard.svg")}
              />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li> */}
        {/* HERE  */}
        {menuValues
          // .sort((a, b) =>
          //   a.m_Order > b.m_Order_Top
          //     ? 1
          //     : b.m_Order_Top > a.m_Order_Top
          //     ? -1
          //     : 0
          // )
          .map((val) => {
            if (val.parent_Module === null || val.parent_Module === "") {
              return (
                <li
                  className={`menu-item ${getMenuItemActive(
                    `${val.navigateUrl}`,
                    false
                  )}`}
                  aria-haspopup="true"
                  key={val.module_ID}
                >
                  <NavLink
                    className="menu-link"
                    to={{
                      pathname: val.navigateUrl,
                      state: "view",
                    }}
                    replace
                  >
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl(
                          `${
                            val.menu_Icons
                              ? val.menu_Icons
                              : "/media/svg/icons/General/Dashboard.svg"
                          }`
                        )}
                      />
                    </span>
                    <span className="menu-text">{val.module_Name}</span>
                  </NavLink>
                </li>
              );
            } else if (val.sub_Parent_Module === "1") {
              return (
                <li
                  className={`menu-item menu-item-parent ${getMenuItemActive(
                    `${val.navigateUrl}`,
                    true
                  )}`}
                  aria-haspopup="true"
                  data-menu-toggle="hover"
                  key={val.module_ID}
                >
                  <NavLink
                    className="menu-link menu-toggle"
                    to={{
                      pathname: val.navigateUrl,
                      state: "view",
                    }}
                    replace
                  >
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl(
                          `${
                            val.menu_Icons
                              ? val.menu_Icons
                              : "/media/svg/icons/General/Dashboard.svg"
                          }`
                        )}
                        style={{ width: "21px", height: "21px" }}
                      />
                    </span>
                    <span className="menu-text">{val.module_Name}</span>
                    <i className="menu-arrow" />
                  </NavLink>

                  <div className="menu-submenu ">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                      {menuValues
                        .filter((one) => one.parent_Module === val.module_Name)
                        .filter((one) => one.sub_Parent_Module !== "1")
                        .sort((a, b) =>
                          a.m_Order > b.m_Order
                            ? 1
                            : b.m_Order > a.m_Order
                            ? -1
                            : 0
                        )
                        .map((sub) => {
                          return (
                            <li
                              className={`menu-item menu-item-submenu ${getMenuItemActive(
                                `${sub.navigateUrl}`,
                                true
                              )}`}
                              aria-haspopup="true"
                              data-menu-toggle="hover"
                              key={sub.module_ID}
                            >
                              <NavLink
                                className="menu-link"
                                to={{
                                  pathname: sub.navigateUrl,
                                  state: "view",
                                }}
                                replace
                              >
                                <span className="svg-icon menu-icon">
                                  <SubSVGStyles
                                    src={toAbsoluteUrl(
                                      `${
                                        sub.menu_Icons
                                          ? sub.menu_Icons
                                          : "/media/svg/icons/General/Dashboard.svg"
                                      }`
                                    )}
                                  />
                                </span>
                                <span className="menu-text">
                                  {sub.module_Name}
                                </span>
                              </NavLink>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </li>
              );
            }
            return null;
          })}
        {/* END HERE */}

        {/*begin::1 Level*/}
        {/* <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Dashboard.svg")}
              />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/requestable", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/requestable" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Requestable.svg")}
                style={{ width: "21px", height: "21px" }}
              />
            </span>
            <span className="menu-text">Requestable Assets</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/requested-list", true)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/requested-list" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/General/Requested-List.svg"
                )}
                style={{ width: "21px", height: "21px" }}
              />
            </span>
            <span className="menu-text">Requested List</span>
          </NavLink>
        </li>

        <li
          className={`menu-item menu-item-parent ${getMenuItemActive(
            "/assets",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/assets" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Asset.svg")}
                style={{ width: "21px", height: "21px" }}
              />
            </span>
            <span className="menu-text">Assets</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Assets</span>
                </span>
              </li>

              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "assets/list-table",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link" to="/assets/list-table" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Asset-list.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Asset List</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/assets/asset-allocation",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link"
                  to="/assets/asset-allocation"
                  replace
                >
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Asset-allocation.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Asset Allocation</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
        <li
          className={`menu-item menu-item-parent ${getMenuItemActive(
            "/Data-Import",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/Data-Import" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Data-Import.svg")}
                style={{ width: "21px", height: "21px" }}
              />
            </span>
            <span className="menu-text">Data Import</span>
          </NavLink>
        </li>
        <li
          className={`menu-item menu-item-parent ${getMenuItemActive(
            "/Settings",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/Settings" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Settings.svg")}
              />
            </span>
            <span className="menu-text">Settings</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Setting</span>
                </span>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/Type",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link " to="/Settings/Type" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl("/media/svg/icons/General/Type.svg")}
                    />
                  </span>
                  <span className="menu-text">Type</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/Category",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link " to="/Settings/Category" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Category.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Category</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/Brand",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link " to="/Settings/Brand" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl("/media/svg/icons/General/Brand.svg")}
                    />
                  </span>
                  <span className="menu-text">Brand</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/Supplier",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link" to="/Settings/Supplier" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Supplier.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Supplier</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/Status",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link" to="/Settings/Status" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl("/media/svg/icons/General/Status.svg")}
                    />
                  </span>
                  <span className="menu-text">Status</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Settings/location",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink className="menu-link" to="/Settings/location" replace>
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Location.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Asset location</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
        <li
          className={`menu-item menu-item-parent ${getMenuItemActive(
            "/Configurations",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink
            className="menu-link menu-toggle"
            to="/Configurations"
            replace
          >
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/General/Configurations.svg"
                )}
              />
            </span>
            <span className="menu-text">Configurations</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Configurations</span>
                </span>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Configurations/Bar_QR",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link "
                  to="/Configurations/Bar_QR"
                  replace
                >
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Barcode-product.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Bar Code & QR Code</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Configurations/Labels",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link "
                  to="/Configurations/Labels"
                  replace
                >
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl("/media/svg/icons/General/Labels.svg")}
                    />
                  </span>
                  <span className="menu-text">Labels</span>
                </NavLink>
              </li>
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/Configurations/Notifications",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link"
                  to="/Configurations/Notifications"
                  replace
                >
                  <span className="svg-icon menu-icon">
                    <SubSVGStyles
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Notification.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Notifications and Alerts</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/Reports", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/Reports" replace>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Reports.svg")}
              />
            </span>
            <span className="menu-text">Reports</span>
          </NavLink>
        </li> */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
