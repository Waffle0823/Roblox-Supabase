import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'TypeScript-First Design',
    description: (
      <>
        Built specifically for the roblox-ts ecosystem with full TypeScript
        support for type-safe Supabase interactions in your Roblox projects.
      </>
    ),
  },
  {
    title: 'Simple API',
    description: (
      <>
        Interact with your Supabase backend using a clean, intuitive API that handles
        authentication and request formatting. Focus on building your game, not infrastructure.
      </>
    ),
  },
  {
    title: 'Roblox Platform Optimized',
    description: (
      <>
        Specifically designed for the Roblox platform with PostgREST integration,
        making database operations from your Roblox games seamless and efficient.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('text--center', 'padding-horiz--md', styles.featureItem)}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
