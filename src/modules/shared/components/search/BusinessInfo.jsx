import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function BusinessInfo() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  return <div>BusinessInfo - {id}</div>;
}
