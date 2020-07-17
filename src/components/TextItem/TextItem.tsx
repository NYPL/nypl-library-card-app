import React from 'react';

/**
 * @desc Verifies that the property value exists and returns it.
 * Otherwise, returns the default value.
 * @param {Object} param - Object containing the nested value
 * @param {String} param - String representation of the language property name.
 * @returns {String} param - Returns the string value for the given property match.
 */
function getProperty(prop = {}, lang = "en", fallback?) {
  const defaultValue = fallback || null;
  return prop && prop[lang] && prop[lang].text ? prop[lang].text : defaultValue;
}

/**
 * @desc Verifies that the string value exists and returns it. Otherwise, returns a hash.
 * @param {String} param - String representation of the target property.
 * @returns {String} param - Returns the string value for the given property match.
 */
function getString(str: string, fallback?) {
  const defaultValue = fallback || null;
  return str !== '' ? str : defaultValue;
}

interface TextItemProps {
  className?: string;
  lang?: string;
  target: string;
  location: string;
  tag: object;
  title: object;
  date: object;
  description: object;
  gaClickEvent: (a, b) => {};
};

const TextItem = ({
  className = 'textItem',
  lang = 'en',
  target,
  tag,
  title,
  description,
  location,
  date,
  gaClickEvent,
}: TextItemProps) => {
  const content = {
    url: getString(target, '#'),
    tag: getProperty(tag, lang, 'ERROR'),
    title: getProperty(title, lang, 'Something has gone wrong.'),
    desc: getProperty(description, lang),
    date: getProperty(date, lang),
    location: getString(location),
  };

  return (
    <div className={className}>
      <a
        href={content.url}
        onClick={gaClickEvent ? () => gaClickEvent('Hero', content.url) : null}
      >
        <span className={`${className}-tag`} aria-hidden="true">{content.tag}</span>
        <h1 className={`${className}-title`}>{content.title}</h1>
        {
          (content.date || content.location) ?
            <div className={`${className}-details`}>
              {content.date ? <span className={`${className}-date`}>{content.date}</span> : null}
              {content.location ?
                <span className={`${className}-location`}>{content.location}</span> : null
              }
            </div>
            :
            <div className={`${className}-description`}>
              {content.desc ? <p>{content.desc}</p> : null}
            </div>
        }
      </a>
    </div>
  );
};

export default TextItem;
