import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Index() {
  return (
    <div>
      <div>
        <h3>indeed</h3>
      </div>
      <div>
        <input type="text" placeholder="input url" />
        <button>登録</button>
      </div>
      <div>
        <div>
          <div>
            <h4>[企業名]</h4>
          </div>
          <div>
            <div>
              <p>[求人1]</p>
              <p>desciprion...</p>
            </div>
            <div>
              <p>[求人2]</p>
              <p>desciprion...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
