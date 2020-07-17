"use strict";

export const AJAX_ERROR = "AJAX_ERROR";

export function ajaxError(error) {
  return {
    type: AJAX_ERROR,
    payload: error,
  };
}
