import { Box } from 'components/Box/Box';
import { components } from 'components/MdxComponents/MdxComponents';
import { TitleAndMetaTags } from 'components/TitleAndMetaTags/TitleAndMetaTags';
import { docsRoutes } from 'lib/docsRoutes';
import { useLiveReload, useMDXComponent } from 'next-contentlayer/hooks';
import React from 'react';
import { Doc, allDocs } from '.contentlayer/generated';

type DocPageProps = { doc: Doc; sectionName: string };

export default function DocPage({ doc, sectionName }: DocPageProps) {
  const Component = useMDXComponent(doc.body.code);
  useLiveReload();

  return (
    <>
      <TitleAndMetaTags
        description={doc.description}
        title={`${doc.title} — RainbowKit`}
      />
      <Box as="article">
        <p data-algolia-lvl0 style={{ display: 'none' }}>
          {sectionName}
        </p>
        <Component components={components} />
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const paths = allDocs.map((doc) => `/${doc._raw.flattenedPath}`);
  return {
    fallback: false,
    paths,
  };
}

export async function getStaticProps({ params, locale }) {
  const doc = allDocs.find(
    (doc) => doc.slug === params.slug && doc.locale === locale,
  );
  const sectionName = docsRoutes.reduce((acc, curr) => {
    curr.pages.forEach((page) =>
      // biome-ignore lint/style/noParameterAssign: TODO
      // biome-ignore lint/suspicious/noAssignInExpressions: TODO
      page.slug === params.slug ? (acc = curr.label) : null,
    );
    return acc;
  }, '');

  return {
    props: {
      doc,
      sectionName,
    },
  };
}
