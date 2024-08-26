import Header from "@/components/common/header";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ServicesList from "@/mocks/services.json";
import { FC, Fragment } from "react";
import { Link } from "react-router-dom";

const ServicesPage: FC = () => {
  const services = ServicesList;

  const RandomImage = () => {
    const images = [
      "/assets/images/1.png",
      "/assets/images/2.gif",
      "/assets/images/3.gif",
      "/assets/images/4.gif",
      "/assets/images/5.gif",
      "/assets/images/6.gif",
      "/assets/images/7.gif",
      "/assets/images/8.gif",
      "/assets/images/9.gif",
      "/assets/images/10.gif",
      "/assets/images/11.gif",
      "/assets/images/12.gif",
      "/assets/images/13.gif",
      "/assets/images/14.gif",
      "/assets/images/15.gif",
    ];
    const random = Math.floor(Math.random() * images.length);
    return images[random];
  };

  return (
    <div className="relative shadow-inner">
      <Header
        title="One Stop Service"
        subtitle="บริการครบจบที่เดียว"
        icon="mapPin"
        color="blue"
        isAvatar
        isShowInput={true}
      />
      <main className="flex h-full w-full flex-col gap-2">
        {services?.map((service, index) => (
          <Fragment key={index}>
            {index !== 0 ? <Separator className="h-2 w-full bg-line-gray-200" /> : null}
            <section>
              <div className={cn("flex items-center justify-between")}>
                <h2 className="text-md px-4 py-2 text-left font-bold">{service.service_name}</h2>
                <Link to="/services" className="cursor-pointer px-4 py-2 text-sm text-line-green hover:underline">
                  ดูทั้งหมด
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {service?.sub_service?.map((sub, j) => (
                  <Sheet key={j}>
                    <SheetTrigger asChild>
                      <div className="grid grid-cols-1 items-center justify-center gap-2">
                        <div className="flex justify-center">
                          <div className={cn("flex items-center justify-center rounded-full p-2")}>
                            <img src={RandomImage()} alt={sub.sub_service_name} className={cn("h-10 w-10")} />
                          </div>
                        </div>
                        <p className="h-10 text-center text-xs text-line-gray-800">{sub.sub_service_name}</p>
                      </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-96 w-full rounded-t-2xl bg-white shadow-xl">
                      <SheetHeader>
                        <SheetTitle>
                          <h3 className="text-md font-bold">{sub.sub_service_name}</h3>
                        </SheetTitle>
                        <SheetDescription>ท่านสามารถเลือกบริการที่ต้องการได้จากเมนูด้านล่าง</SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </section>
          </Fragment>
        ))}
      </main>
    </div>
  );
};

export default ServicesPage;
