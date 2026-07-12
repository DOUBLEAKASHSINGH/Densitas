import React from 'react';

export default function GenericContentPage({ title, subtitle, content }) {
  return (
    <div className="w-full min-h-full flex flex-col bg-white">
      <div className="bg-indigo-600 px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-indigo-100">
            {subtitle}
          </p>
        </div>
      </div>
      
      <div className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-slate-700 space-y-6">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
