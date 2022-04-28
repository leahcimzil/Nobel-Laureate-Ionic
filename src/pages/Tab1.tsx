import { IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import ExploreContainer from '../components/DeviceInfo';
import './Tab1.css';
import axios from 'axios';

let nextLink: string = 'https://api.nobelprize.org/2.1/laureates'
let totalCount:number;

const Tab1: React.FC = () => {

  const [laureates, setLaureates] = useState<Array<any>>([])
  const [isScrollDisabled, setScrollDisabled] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('');
  const [showLoading, setShowLoading] = useState(true);

  const retrieveData = () => {
    return new Promise((resolve, reject)=>{

      axios.get(nextLink)
        .then(response => {
          nextLink = response.data.links && response.data.links.next ? response.data.links.next : ''
          totalCount = response.data.meta.count
          const newLaureates = response.data.laureates.map((laureate: any) => {
            return {
              id: laureate.id,
              name: (laureate.fullName !== undefined) ? laureate.fullName.en : laureate.orgName.en 
            }
          })
          setShowLoading(false);
          resolve(newLaureates)
        })
    })
  }


  //search api
  useEffect(()=>{

    (async () => {
      nextLink = `https://api.nobelprize.org/2.1/laureates?name=${searchText}`;
      setShowLoading(true);
      const newLaureates: any = await retrieveData();
      setLaureates(newLaureates);
    })() 
  }, [searchText])


  //get our data
  useEffect(()=>{

    (async () => {
      const newLaureates: any = await retrieveData();
      setLaureates(newLaureates);
      
    })()

  }, [])


  useEffect(()=>{
    console.log(laureates.length)
    if (laureates.length === totalCount){
      setScrollDisabled(true)
    }
    else{
      setScrollDisabled(false)
    }
  }, [laureates])


  const loadMoreData = async (e: CustomEvent) =>{
    const newLaureates: any = await retrieveData();
    (e.target as HTMLIonInfiniteScrollElement).complete();
    setLaureates([
      ...laureates,
      ...newLaureates
    ]) 
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nobel Lauretes</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading
        cssClass= 'my-custom-class'
        isOpen = {showLoading}
        message = {'Loading data...'}
        duration={1000}
        />
        <IonList>
          {
            laureates.map((laureate: any)=>{
              return (
              <IonItem routerLink={`/tab1/details/${laureate.id}`} key={laureate.id} button detail>
                <IonLabel>{laureate.name}</IonLabel>
              </IonItem>)

            })
          }
        </IonList>

        <IonInfiniteScroll
          onIonInfinite= {loadMoreData}
          threshold="100px"
          disabled={isScrollDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
